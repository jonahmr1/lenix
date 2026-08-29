import type { Vec3 } from '../shared/types.ts'
import { entity } from './client.ts'
import { player as client } from './client.ts'

/**
 * Finds the nearest coordinates from a list.
 */
const coords = (coords: Vec3, zones: Vec3[]): Vec3 | undefined => {
	let closest: Vec3 | undefined
	let radialSpace = Infinity

	for (const zone of zones) {
		const dx = zone[0] - coords[0]
		const dy = zone[1] - coords[1]
		const dz = zone[2] - coords[2]
		const distance = dx * dx + dy * dy + dz * dz

		if (distance < radialSpace) {
			radialSpace = distance
			closest = zone
		}
	}

	return closest
}

/**
 * Finds the nearest player around the provided coordinates.
 */
const player = (
	coords: Vec3,
	maxDistance = 2.0,
	includePlayer = false
): number | null => {

	let closestId

	for (const playerId of GetActivePlayers() as number[]) {

		if (playerId !== client.id() || includePlayer) {
			const playerPed = GetPlayerPed(playerId)
			const vehicle = GetVehiclePedIsIn(playerPed, false)
			const playerCoords: Vec3 =
				vehicle === 0
				? entity.coords(playerPed, true)
				: GetWorldPositionOfEntityBone(playerPed, 0) as Vec3

			const distance = Math.sqrt(
				(coords[0] - playerCoords[0]) ** 2 +
				(coords[1] - playerCoords[1]) ** 2 +
				(coords[2] - playerCoords[2]) ** 2
			)

			if (distance < maxDistance) {
				maxDistance = distance
				closestId = playerId
			}
		}
	}

	return closestId ?? null
}

/**
 * Finds the nearest vehicle around an entity.
 */
const vehicle = (entityHandle: number, radialSpace: number): number | undefined => {
	const coords: Vec3 = entity.coords(entityHandle, true)
	const vehicles = GetGamePool('CVehicle') as number[]

	let closest: number | undefined

	for (const vehicle of vehicles) {
		const vehCoords: Vec3 = entity.coords(vehicle, true)
		const x = coords[0] - vehCoords[0]
		const y = coords[1] - vehCoords[1]
		const z = coords[2] - vehCoords[2]
		const distance = Math.sqrt(x * x + y * y + z * z)

		if (distance < radialSpace) {
			radialSpace = distance
			closest = vehicle
		}
	}

	return closest
}

export const getNearest = {
	player,
	vehicle,
	coords
}
