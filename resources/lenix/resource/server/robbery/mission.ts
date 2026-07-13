import { random, VEHICLE_BLIP_UPDATE_INTERVAL, VEHICLE_COORDS, VEHICLE_MODEL } from "common/robbery"
import { isRobberyRunning, teams } from "."
import { CreateVehicle, type OxVehicle } from "@overextended/ox_core/server"

const vehicleDoorsBroken = {
	left: false,
	right: false
}
let veh: OxVehicle
let interval: CitizenTimer

export const startRobbery = async () => {
	const randomIndex = random(VEHICLE_COORDS.length - 1)
	const coords = VEHICLE_COORDS[randomIndex]
	if (!coords) throw new Error(`Failed to get the coords at #${randomIndex} from VEHICLE_COORDS`)

	const vehicle = await CreateVehicle(VEHICLE_MODEL, [coords[0], coords[1], coords[2]], coords[3])
	if (!vehicle) throw new Error(`Failed to create the vehicle`)

	veh = vehicle

	teams.forEach(team => {
		team.teammates.forEach(teammate => {
			addPlayerToRobbery(teammate)
		})
	})

	emitNet('lenix:client:robbery:startrobbery', -1, vehicle?.netId)

	interval = setInterval(() => {
		GlobalState.robberyVehicleCoords = vehicle?.getCoords()
	}, VEHICLE_BLIP_UPDATE_INTERVAL)
}

export const addPlayerToRobbery = (playerId: number) => {
	emitNet('ox_lib:notify', playerId, {
		type: 'success',
		title: 'A new truck to rob can be found in the map'
	})
}

onNet('lenix:server:robbery:breakdoor', (side: 'left' | 'right') => {
	vehicleDoorsBroken[side] = true
	emitNet('lenix:client:robbery:updatedoors', -1, side, true)
})

onNet('lenix:server:robbery:takemoney', (netId: number) => {
	globalThis.exports.ox_inventory.AddItem(source, 'money', 10000)

	const tick = setTick(() => {
		const entity = NetworkGetEntityFromNetworkId(netId)
		if (!DoesEntityExist(entity)) return

		setTimeout(veh.despawn, 60_000)
		clearTick(tick)
	})

	isRobberyRunning = false
	teams.forEach(team => {
		team.teammates.forEach(teammate => {
			emitNet('lenix:client:robbery:removefromteam', teammate)
		})
	})
	emitNet('lenix:client:robbery:updatedoors', -1, 'right', false)
	emitNet('lenix:client:robbery:updatedoors', -1, 'left', false)
	teams.clear()
	clearInterval(interval)
})
