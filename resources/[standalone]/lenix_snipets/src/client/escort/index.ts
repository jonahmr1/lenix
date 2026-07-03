import type { Vector3 } from ".."

const getPlayerInFront = (): number | null => {
	const playerPed = PlayerPedId()
	const coords = GetEntityCoords(playerPed, false) as Vector3
	const forward = GetEntityForwardVector(playerPed) as Vector3
	const dest = [
		coords[0] + forward[0] * 3,
		coords[1] + forward[1] * 3,
		coords[2] + forward[2] * 3,
	] as Vector3

	const ray = StartShapeTestCapsule(coords[0], coords[1], coords[2], dest[0], dest[1], dest[2], 1, 12, playerPed, 7)
	const [, hit, , , entity] = GetShapeTestResult(ray)
	if (!hit || !IsEntityAPed(entity) || !IsPedAPlayer(entity)) return null

	return GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
}

const getEscortedByEscorter = (escorterPed: number): number => {
	const players = GetActivePlayers()
	for (const playerId of players) {
		const ped = GetPlayerPed(playerId)
		if (ped === escorterPed) continue
		if (IsEntityAttachedToEntity(ped, escorterPed)) return ped
	}
	return -1
}

onNet('ox:useEscort', () => {
	const playerPed = PlayerPedId()

	// already escorting someone — release them, no need to re-aim
	const attachedEntity = getEscortedByEscorter(playerPed)
	if (attachedEntity !== -1) {
		const targetId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(attachedEntity))
		emitNet('ox:toggleEscort', targetId)
		return
	}

	const targetId = getPlayerInFront()
	if (!targetId) return
	emitNet('ox:toggleEscort', targetId)
})

const applyEscortState = (playerId: number, escorterSource: number | false) => {
	if (playerId !== PlayerId()) return

	const ped = PlayerPedId()

	if (escorterSource) {
		const escorterPlayerId = GetPlayerFromServerId(escorterSource)
		if (escorterPlayerId === -1) return
		const escorterPed = GetPlayerPed(escorterPlayerId)

		AttachEntityToEntity(
			ped, escorterPed, GetPedBoneIndex(escorterPed, 60309),
			0.6, 0.5, 0.0, 0.0, 0.0, 0.0,
			false, false, false, false, 2, true
		)
	} else {
		DetachEntity(ped, true, true)
	}
}

AddStateBagChangeHandler('isEscorted', '', (bagName: string, _key: string, value: number | false) => {
	const playerId = GetPlayerFromStateBagName(bagName)
	if (playerId === 0) return
	applyEscortState(playerId, value)
})

RegisterCommand('breakfree', () => {
	emitNet('ox:breakFree')
}, false)