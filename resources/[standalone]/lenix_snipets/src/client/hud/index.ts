import { cache } from "@overextended/ox_lib"

type OxWeapon = {
	ammo: string
	metadata: { ammo: number }
} | undefined

let turnedOff: boolean

const updateHud = ({ clip, reserve }: { clip?: string, reserve: string } | { clip: string, reserve?: string }) => {
	SendNuiMessage(JSON.stringify({
		key: `update:${clip ? 'clip' : 'reserve'}`,
		value: { clip, reserve }
	}))
}

const toggleHud = (value: boolean) => SendNuiMessage(JSON.stringify({ key: 'display', value }))


const getReserve = (ammoName: string): number => exports.ox_inventory.Search('count', ammoName)

const updateClip = (weapon: number) => {
	const clip = GetAmmoInClip(cache.ped, weapon)[1].toString()
	updateHud({ clip })
}

const updateReserve = (reserve: string) => {
	updateHud({ reserve })
}

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
	const weapon: OxWeapon = exports.ox_inventory.getCurrentWeapon()
	if (!weapon) return
	if (weapon.ammo !== itemName) return

	updateReserve(totalCount.toString())
})

on('ox:playerLoaded', () => toggleHud(true))
onNet('ox:startCharacterSelect', () => toggleHud(false))