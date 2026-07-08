import { cache } from "@overextended/ox_lib"
import type { Request, Vector3 } from "types/index"

export const emitEvent = <T extends [string, any[]]>(id: T[0], ...params: T[1]) => {
	if (
		!SendNuiMessage(
			JSON.stringify({
				id,
				...params,
			}),
		)
	)
		throw new Error('SendNuiMessage returned falsy')
}

export const onNui = <T extends Request<unknown, string, object>>(
	id: T[1],
	cb: (data: T[2]) => T[0],
) => {
	RegisterNuiCallback(id, (data: T[2], reply: Function) => reply(cb(data)))
}

export const getNearestCoords = (coords: Vector3, zones: Vector3[]): Vector3 | undefined => {
	let closest: Vector3 | undefined
	let closestDistance = Infinity

	for (const zone of zones) {
		const dx = zone[0] - coords[0]
		const dy = zone[1] - coords[1]
		const dz = zone[2] - coords[2]
		const distance = dx * dx + dy * dy + dz * dz

		if (distance < closestDistance) {
			closestDistance = distance
			closest = zone
		}
	}

	return closest
}

export const getClosestPlayer = (
	coords: Vector3,
	maxDistance = 2.0,
	includePlayer = false,
): {
	playerId?: number
	playerPed?: number
	playerCoords?: Vector3
	playerVehicle?: number
} => {
	const players = GetActivePlayers()

	let closestId: number | undefined
	let closestPed: number | undefined
	let closestCoords: Vector3 | undefined
	let closestVehicle: number | undefined

	for (let i = 0; i < players.length; i++) {
		const playerId = players[i]

		if (playerId !== cache.playerId || includePlayer) {
			const playerPed = GetPlayerPed(playerId)
			const vehicle = GetVehiclePedIsIn(playerPed, false)
			const playerCoords = (
				vehicle === 0 ? GetEntityCoords(playerPed, false) : GetWorldPositionOfEntityBone(playerPed, 0)
			) as Vector3

			const distance = Vdist(coords[0], coords[1], coords[2], playerCoords[0], playerCoords[1], playerCoords[2])

			if (distance < maxDistance) {
				maxDistance = distance
				closestId = playerId
				closestPed = playerPed
				closestCoords = playerCoords
				closestVehicle = vehicle
			}
		}
	}

	return { playerId: closestId, playerPed: closestPed, playerCoords: closestCoords, playerVehicle: closestVehicle }
}
