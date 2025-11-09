function createSingleVehicle(settings) {
	const modelHash = settings.modelHash
	const coords = settings.coords
	const isAccessPublic = settings.isAccessPublic
	const isControlPublic = settings.isControlPublic

	if (Array.isArray(coords)) {
		coords = {
			x: coords[0],
			y: coords[1],
			z: coords[2],
			w: coords[3]
		}
	}
	const handle = CreateVehicle(modelHash, coords.x, coords.y, coords.z, coords.w, !!isAccessPublic, !!isAccessPublic && !isControlPublic)
	return handle
}

function createMultipleVehicles(vehicles, defaultSettings) {
	const handles = []
	vehicles.forEach(vehicle => {
		handles.push(createSingleVehicle({
			modelHash: vehicle.model || defaultSettings.modelHash,
			coords: vehicle.coords,
			isAccessPublic: vehicle.isAccessPublic || defaultSettings.isAccessPublic,
			isControlPublic: vehicle.isControlPublic || defaultSettings.isControlPublic
		}))
	});
	return handles
}

function clearCreatedVehicle(vehicle) {
	if (typeof vehicle !== 'number') {
		console.log(`received ${typeof vehicle} instead of a number, if you passed an array of number to delete multiple vehicles, please use clearCreatedVehicles instead of clearCreatedVehicle`)
	}
	return DeleteEntity(vehicle)
}

function clearCreatedVehicles(vehicles) {
	if (!Array.isArray(vehicles)) {
		console.log(`received ${typeof vehicles} instead of array, use clearCreatedVehicle for single vehicle`)
	}
	for (let i = 0; i < vehicles.length; i++) {
		DeleteEntity(vehicles[i]);
	}
	return true
}

lib.callback.register('createSingleVehicle', function(settings) {
	return createSingleVehicle(settings)
})

lib.callback.register('createMultipleVehicles', function(settings, defaultSettings) {
	return createMultipleVehicles(settings, defaultSettings)
})

lib.callback.register('clearCreatedVehicle', function(vehicle) {
	return clearCreatedVehicle(vehicle)
})

lib.callback.register('clearCreatedVehicles', function(vehicles) {
	return clearCreatedVehicles(vehicles)
})

exports('createSingleVehicle', createSingleVehicle)
exports('createMultipleVehicles', createMultipleVehicles)
exports('clearCreatedVehicle', clearCreatedVehicle)
exports('clearCreatedVehicles', clearCreatedVehicles)