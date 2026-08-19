import { cache, checkDependency } from '@overextended/ox_lib'
import type { Events } from 'types/index'
import { emitNui, pool } from 'lenix/client'
import { api } from 'lenix/client'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_inventory', '2.47.9', true)
checkDependency('ox_core', '1.5.14', true)

type OxWeapon =
	| {
		ammo: string
		metadata: { ammo: number }
	}
	| undefined

let turnedOff = false

const updateHud = (type: 'clip' | 'reserve', value: string) => {
	if (type === 'clip') {
		if (!IsPedShooting(cache.ped)) return
		emitNui<Events['updateHudClip']>('hud:update:clip', value)
		return
	}

	emitNui<Events['updateHudReserve']>('hud:update:reserve', value)
}

const toggleHud = (value: boolean) => emitNui<Events['displayHud']>('hud:display', value)

const getReserve = (ammoName: string): number => api.ox_inventory?.GetItemCount?.<number, [unknown]>(ammoName) ?? 0

const updateClip = (weapon: number) => updateHud('clip', GetAmmoInClip(cache.ped, weapon)[1].toString())

const updateReserve = (reserve: string) => updateHud('reserve', reserve)

const setHudState = () => {
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
	const weapon: OxWeapon = api.ox_inventory?.getCurrentWeapon<OxWeapon>?.()
	if (!weapon) return
	if (weapon.ammo !== itemName) return

	updateReserve(totalCount.toString())
})

onNet('ox:startCharacterSelect', () => toggleHud(false))

pool(() => {
	setHudState()
})