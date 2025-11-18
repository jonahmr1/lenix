async function createSingleVehicle(settings) {
	return await lib.callback.await('createSingleVehicle', lib.source, settings)
}

async function createMultipleVehicles(vehicles, defaultSettings) {
	const promises = vehicles.map(vehicle => {
		createSingleVehicle({
			hash: vehicle?.hash || defaultSettings.hash,
			coords: vehicle.coords,
			preCreate: vehicle?.preCreate || defaultSettings?.preCreate,
		})}
	)
	return await Promise.all(promises)
}

function clearCreatedVehicle(netId) {
	if (typeof netId !== 'number') {
		console.log(`received ${typeof netId} instead of a number, if you passed an array of number to delete multiple vehicles, please use clearCreatedVehicles instead of clearCreatedVehicle`)
		return false
	}
	const vehicle = NetworkGetEntityFromNetworkId(netId)
	if (!DoesEntityExist(vehicle)) {
		console.warn('Could not clear the vehicle with the net id of: ' + netId)
		return false
	}
	DeleteEntity(vehicle)
	return true
}

async function clearCreatedVehicles(netIds) {
	if (!Array.isArray(netIds)) {
		console.log(`received ${typeof netIds} instead of array, use clearCreatedVehicle for single vehicle`)
		return false
	}
	for (let i = 0; i < netIds.length; i++) {
		await createSingleVehicle(netIds[i])
	}
	return true
}

lib.callback.register('createMultipleVehicles', function(_, settings, defaultSettings) {
	return createMultipleVehicles(settings, defaultSettings)
})

lib.callback.register('clearCreatedVehicle', function(_, vehicle) {
	return clearCreatedVehicle(vehicle)
})

lib.callback.register('clearCreatedVehicles', function(_, vehicles) {
	return clearCreatedVehicles(vehicles)
})

exports('createSingleVehicle', createSingleVehicle)
exports('createMultipleVehicles', createMultipleVehicles)
exports('clearCreatedVehicle', clearCreatedVehicle)
exports('clearCreatedVehicles', clearCreatedVehicles)