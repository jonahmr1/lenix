import { client, getNearest } from 'lenix/client'
import { cache, checkDependency } from '@overextended/ox_lib'
import { notify } from '@overextended/ox_lib/client'
import type { Vector3 } from 'types'

checkDependency('ox_lib', '3.39.0', true)

on('lenix:client:escort', () => {
	const nearest = getNearest.player(GetEntityCoords(cache.ped, false) as Vector3, 2.0, false)
	if (!nearest.playerId) {
		notify({ title: 'No one nearby!' })
		return
	}
	const targetId = GetPlayerServerId(nearest.playerId)
	const isCuffed = Player(targetId).state.isCuffed
	if (!isCuffed) {
		notify({ title: 'The person is not weak enough to get cuffed' })
		return
	}
	emitNet('lenix:server:escort', targetId)
})

onNet('lenix:client:escort:toggle', (serverId: number, state: boolean) => {
	if (state) {
		AttachEntityToEntity(
			cache.ped,
			client.player.entity(client.player.id(serverId)),
			11816,
			0.45,
			0.45,
			0.0,
			0.0,
			0.0,
			0.0,
			false,
			false,
			false,
			false,
			2,
			true,
		)
	} else {
		DetachEntity(cache.ped, true, false)
	}
})
