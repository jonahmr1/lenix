import { getSafeById, HOTEL_SAFES } from 'common/hotel'

const SAFE_SIZE = [1.66, 1.66, 1.66] as const

for (const [room, { coords, rotation }] of Object.entries(HOTEL_SAFES)) {
	globalThis.exports.ox_target.addBoxZone({
		coords: coords,
		size: SAFE_SIZE,
		rotation: rotation,
		options: {
			label: 'Open Safe',
			onSelect: () => globalThis.exports.ox_inventory.openInventory('stash', getSafeById(Number(room)))
		},
	})
}
