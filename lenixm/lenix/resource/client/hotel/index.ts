import { GetPlayer } from '@overextended/ox_core/client'
import { getSafeById, HOTEL_SAFES } from 'common/hotel'

const SAFE_SIZE = [1.66, 1.66, 1.66] as const

for (const [room, { coords, rotation }] of Object.entries(HOTEL_SAFES)) {
	globalThis.exports.ox_target.addBoxZone({
		coords: coords,
		size: SAFE_SIZE,
		rotation: rotation,
		options: {
			label: 'Open Safe',
			onSelect: () => globalThis.exports.ox_inventory.openInventory('stash', getSafeById(Number(room))),
		},
	})
}

on('ox:playerLoaded', async (_playerId: number, isNew: boolean) => {
	if (isNew) return

	const player = GetPlayer()
	if (!player) return

	const charId = player.charId
	if (!charId) return

	emitNet('lenix:server:hotel:loadStashes', charId)
})
