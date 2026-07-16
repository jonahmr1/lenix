// deno-lint-ignore-file no-undef
import type { Vec3 } from '../types/index.ts'
import { getEntity } from './entity.ts'

const coords = (coords: Vec3, zones: Vec3[]): Vec3 | undefined => {
	let closest: Vec3 | undefined
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

const player = (
	coords: Vec3,
	maxDistance = 2.0,
	includePlayer = false
): {
	playerId?: number,
	playerPed?: number,
	playerCoords?: Vec3,
	playerVehicle?: number
} => {
	const players = GetActivePlayers()

	let closestId: number | undefined
	let closestPed: number | undefined
	let closestCoords: Vec3 | undefined
	let closestVehicle: number | undefined

	for (let i = 0; i < players.length; i++) {
		const playerId = players[i]

		if (playerId !== PlayerPedId() || includePlayer) {
			const playerPed = GetPlayerPed(playerId)
			// deno-lint-ignore no-boolean-literal-for-arguments
			const vehicle = GetVehiclePedIsIn(playerPed, false)
			const playerCoords = (
				vehicle === 0
					? getEntity.coords(playerPed)
					: GetWorldPositionOfEntityBone(playerPed, 0)
			) as Vec3

			const distance = Vdist(
				coords[0],
				coords[1],
				coords[2],
				playerCoords[0],
				playerCoords[1],
				playerCoords[2]
			)

			if (distance < maxDistance) {
				maxDistance = distance
				closestId = playerId
				closestPed = playerPed
				closestCoords = playerCoords
				closestVehicle = vehicle
			}
		}
	}

	return {
		playerId: closestId,
		playerPed: closestPed,
		playerCoords: closestCoords,
		playerVehicle: closestVehicle
	}
}

const vehicle = (entity: number, radialSpace: number): number | undefined => {
	const coords = GetEntityCoords(entity)
	const vehicles = GetGamePool('CVehicle') as number[]

	let closest: number | undefined
	let closestDistance = radialSpace

	for (const vehicle of vehicles) {
		const vehCoords = GetEntityCoords(vehicle)
		const x = coords[0] - vehCoords[0]
		const y = coords[1] - vehCoords[1]
		const z = coords[2] - vehCoords[2]
		const distance = Math.sqrt(x * x + y * y + z * z)

		if (distance < closestDistance) {
			closestDistance = distance
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
