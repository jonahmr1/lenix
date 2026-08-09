import { GetPlayer } from '@overextended/ox_core/client'
import { checkDependency, getNearbyVehicles, notify } from '@overextended/ox_lib/client'
import { Vector3 } from '@overextended/core/vector'
import { getNearest } from 'lenix/client'
import type { Vec3 } from 'lenix'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_core', '1.5.14', true)

const getNearestVehicle = (coords: Vec3): [Vec3 | undefined, number | undefined] => {
	const vehicles = getNearbyVehicles(new Vector3(...coords), 3.0)
	const zoneCoords: Vec3[] = vehicles.map(({ coords: { x, y, z } }) => [x, y, z])

	const closestCoords = getNearest.coords(coords, zoneCoords)
	const closestVehicle = vehicles.find(vehicle =>
		vehicle.coords.toArray().every((vehicle, i) => vehicle === closestCoords?.[i]),
	)?.vehicle
	return [closestCoords, closestVehicle]
}

on('lenix:client:interactions:in', () => {
	const coords = GetPlayer().getCoords() as Vec3
	const [closestCoords, closestVehicle] = getNearestVehicle(coords)
	if (!closestCoords || !closestVehicle) {
		notify({ title: 'No nearby vehicle found!' })
		return
	}

	const nearest = getNearest.player(coords as Vec3, 2.0, false)
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
		emitNet('lenix:server:interactions:put', targetId, NetworkGetNetworkIdFromEntity(closestVehicle), seat)
		break
	}
})

on('lenix:client:interactions:out', () => {
	const coords = GetPlayer().getCoords() as Vec3
	const [closestCoords, closestVehicle] = getNearestVehicle(coords)
	if (!closestCoords || !closestVehicle) {
		notify({ title: 'No nearby vehicle found!' })
		return
	}
	for (let seat = -1; seat <= GetVehicleMaxNumberOfPassengers(closestVehicle); seat++) {
		const ped = GetPedInVehicleSeat(closestVehicle, seat)
		if (!ped) continue

		emitNet(
			'lenix:server:interactions:take',
			GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped)),
			NetworkGetNetworkIdFromEntity(closestVehicle),
			seat,
		)
		return
	}
	notify({ title: 'The vehicle has no one in' })
})
