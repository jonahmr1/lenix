import { GetPlayer } from '@overextended/ox_core/client'
import { getSafeById, HOTEL_SAFES } from 'common/config'
import { api } from 'lenix/client'

const SAFE_SIZE = [1.66, 1.66, 1.66] as const

for (const [room, { coords, rotation }] of Object.entries(HOTEL_SAFES)) {
	api.ox_target?.addBoxZone?.({
		coords: coords,
		size: SAFE_SIZE,
		rotation: rotation,
		options: {
			label: 'Open Safe',
			onSelect: () => api.ox_inventory?.openInventory?.('stash', getSafeById(Number(room))),
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
