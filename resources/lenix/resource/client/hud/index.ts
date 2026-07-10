import { cache } from '@overextended/ox_lib'
import type { Events } from 'types/index'
import { emitEvent } from '../_lib'

type OxWeapon =
	| {
			ammo: string
			metadata: { ammo: number }
	  }
	| undefined

let turnedOff = false
let lastReloadState = false

const updateHud = (type: 'clip' | 'reserve', value: string) => {
	const isReloading = IsPedReloading(cache.ped)
	
	if (isReloading && !lastReloadState) {
		emit('ox_inventory:suppressItemNotifications', true)
	} else if (!isReloading && lastReloadState) {
		emit('ox_inventory:suppressItemNotifications', false)
	}

	lastReloadState = isReloading

	if (type === 'clip') {
		if (!IsPedShooting(cache.ped)) return
		emitEvent<Events['updateHudClip']>('hud:update:clip', value)
		return
	}

	emitEvent<Events['updateHudReserve']>('hud:update:reserve', value)
}

const toggleHud = (value: boolean) => emitEvent<Events['displayHud']>('hud:display', value)

const getReserve = (ammoName: string): number => globalThis.exports.ox_inventory.Search('count', ammoName)

const updateClip = (weapon: number) => updateHud('clip', GetAmmoInClip(cache.ped, weapon)[1].toString())

const updateReserve = (reserve: string) => updateHud('reserve', reserve)

export const setHudState = () => {
	const weapon = GetSelectedPedWeapon(cache.ped)
	const hasWeapon = GetMaxAmmo(cache.ped, weapon)[1] > 0

	if (hasWeapon === turnedOff) {
		toggleHud(hasWeapon)
		turnedOff = !hasWeapon
	}
	updateClip(weapon)
}

on('ox_inventory:currentWeapon', (weapon: OxWeapon) => {
	if (!weapon) return

	const reserve = getReserve(weapon.ammo).toString()
	updateReserve(reserve)
})

on('ox_inventory:itemCount', (itemName: string, totalCount: number) => {
	const weapon: OxWeapon = globalThis.exports.ox_inventory.getCurrentWeapon()
	if (!weapon) return
	if (weapon.ammo !== itemName) return

	updateReserve(totalCount.toString())
})

onNet('ox:startCharacterSelect', () => toggleHud(false))
