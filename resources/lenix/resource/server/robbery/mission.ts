export const startRobbery = () => {
	const randomIndex = random(VEHICLE_COORDS.length - 1)
	const coords = VEHICLE_COORDS[randomIndex]
	if (!coords) throw new Error(`Failed to get the coords at #${randomIndex} from VEHICLE_COORDS`)

	const vehicle = await createVehicle(VEHICLE_MODEL, 'automobile', ...coords)

	teams.forEach(team => {
		team.teammates.forEach(teammate => {
			addPlayerToRobbery(teammate)
		})
	})

	emitNet('lenix:client:robbery:spawnPeds', -1, vehicle.netId)

	setInterval(() => {
		GlobalState.robberyVehicleCoords = vehicle.getCoords()
	}, VEHICLE_BLIP_UPDATE_INTERVAL)

	on('onResourceStop', () => {
		DeleteEntity(vehicle.handle)
	})
}

onNet('lenix:server:robbery:breakdoor', (side: 'left' | 'right', netId: number) => {
	vehicleDoorsBroken[side] = true
	emitNet('lenix:client:robbery:opendoors', -1, side, netId)
})

onNet('lenix:server:robbery:takemoney', (netId: number) => {
	globalThis.exports.ox_inventory.AddItem(source, 'money', 10000)

	const tick = setTick(() => {
		const entity = NetworkGetEntityFromNetworkId(netId)
		if (!DoesEntityExist(entity)) return

		DeleteEntity(entity)
		clearTick(tick)
	})
})