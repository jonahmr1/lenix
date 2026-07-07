import { cache } from "@overextended/ox_lib"
import { notify } from "@overextended/ox_lib/client"
import type { Vector3 } from "types"
import { getClosestPlayer } from ".."

onNet('ox:escort', () => {
	const nearest = getClosestPlayer(GetEntityCoords(cache.ped, false) as Vector3, 2.0, false)
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
	emitNet('ox:server:escort', targetId)
})

onNet('ox:toggleEscort', (serverId: number, state: boolean) => {
	if (state) {
		AttachEntityToEntity(cache.ped, GetPlayerPed(GetPlayerFromServerId(serverId)), 11816, 0.45, 0.45, 0.0, 0.0, 0.0, 0.0, false, false, false, false, 2, true)
	} else {
		DetachEntity(cache.ped, true, false)
	}
})
