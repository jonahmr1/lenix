import { entries } from '@lenix/lenix'
import { GetPlayer } from '@overextended/ox_core/client'
import { checkDependency } from '@overextended/ox_lib'
import { getSafeById, HOTEL_SAFES } from 'common/config'
import { api } from 'lenix/client'

checkDependency('ox_core', '1.5.14', true)
checkDependency('ox_target', '1.18.1', true)
checkDependency('ox_inventory', '2.47.9', true)

const SAFE_SIZE = [1.66, 1.66, 1.66] as const

for (const [room, { coords, rotation }] of entries(HOTEL_SAFES)) {
	api.ox_target?.addBoxZone?.({
		coords: coords,
		size: SAFE_SIZE,
		rotation: rotation,
		options: {
			label: 'Open Safe',
			onSelect: () => api.ox_inventory?.openInventory?.('stash', getSafeById(room)),
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
