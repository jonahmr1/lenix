import { cache } from "@overextended/ox_lib"
import type { Callbacks } from "types/index"
import { emitCb } from ".."

type OxWeapon = {
	ammo: string
	metadata: { ammo: number }
} | undefined

let turnedOff = false

const updateHud = (type: 'clip' | 'reserve', value: string) => {
	if (type === 'clip') return emitCb<Callbacks['updateHudClip']>('hud:update:clip', value)

	emitCb<Callbacks['updateHudReserve']>('hud:update:reserve', value)
}

const toggleHud = (value: boolean) => SendNuiMessage(JSON.stringify({ key: 'hud:display', value }))

const getReserve = (ammoName: string): number => globalThis.exports.ox_inventory.Search('count', ammoName)

const updateClip = (weapon: number) => updateHud('clip', GetAmmoInClip(cache.ped, weapon)[1].toString())

const updateReserve = (reserve: string) => updateHud('reserve', reserve)

export const setHudState = () => {
	const weapon = GetSelectedPedWeapon(cache.ped);
	const hasWeapon = GetMaxAmmo(cache.ped, weapon)[1] > 0;

	if (hasWeapon === turnedOff) {
		toggleHud(hasWeapon);
		turnedOff = !hasWeapon;
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