import { GetPlayer } from "@overextended/ox_core/client"
import { getNearbyVehicles, notify } from "@overextended/ox_lib/client"
import { Vector3 } from '@overextended/core/vector';
import type { Vector3 as Vec3 } from 'types/public'
import { getClosestPlayer } from "../closest";

const getNearestCoords = (
	coords: Vec3,
	zones: Vec3[]
): Vec3 | undefined => {
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

const getNearestVehicle = (coords: Vec3): [Vec3 | undefined, number | undefined]  => {
	const vehicles = getNearbyVehicles(new Vector3(...coords), 3.0)
	const zoneCoords: Vec3[] = vehicles.map(({ coords: { x, y, z } }) => [x, y, z])

	const closestCoords = getNearestCoords(coords, zoneCoords)
	const closestVehicle = vehicles.find(vehicle => vehicle.coords.toArray().every((vehicle, i) => vehicle === closestCoords?.[i]))?.vehicle
	return [closestCoords, closestVehicle]
}

onNet('ox:interactions:in', () => {
	const coords = GetPlayer().getCoords() as Vec3
	const [closestCoords, closestVehicle] = getNearestVehicle(coords)
	if (!closestCoords || !closestVehicle) {
		notify({ title: 'No nearby vehicle found!' })
		return
	}

	const nearest = getClosestPlayer(coords as Vec3, 2.0, false)
	if (!nearest.playerId || !nearest.playerPed) {
		notify({ title: 'No one nearby!' })
		return
	}
	
	const targetId = GetPlayerServerId(nearest.playerId)
	const isCuffed = Player(targetId).state.isCuffed
	if (!isCuffed) {
		notify({ title: 'The person is not weak enough to put in vehicle' })
		return
	}

	for (let seat = 0; seat <= GetVehicleMaxNumberOfPassengers(closestVehicle); seat++) {
		if (!IsVehicleSeatFree(closestVehicle, seat)) continue
		emitNet('ox:interactions:put', targetId, NetworkGetNetworkIdFromEntity(closestVehicle), seat)
		break
	}
})

onNet('ox:interactions:out', () => {
	const coords = GetPlayer().getCoords() as Vec3
	const [closestCoords, closestVehicle] = getNearestVehicle(coords)
	if (!closestCoords || !closestVehicle) {
		notify({ title: 'No nearby vehicle found!' })
		return
	}
	for (let seat = -1; seat <= GetVehicleMaxNumberOfPassengers(closestVehicle); seat++) {
		const ped = GetPedInVehicleSeat(closestVehicle, seat)
		if (!ped) continue
		
		emitNet('ox:interactions:take', GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped)), NetworkGetNetworkIdFromEntity(closestVehicle), seat)
		return
	}
	notify({ title: 'The vehicle has no one in' })
})
