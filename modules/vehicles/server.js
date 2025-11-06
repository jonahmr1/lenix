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

lib.callback.register('createSingleVehicle', function(settings) {
	return createSingleVehicle(settings)
})

lib.callback.register('createMultipleVehicles', function(settings, defaultSettings) {
	return createMultipleVehicles(settings, defaultSettings)
})

exports('createSingleVehicle', createSingleVehicle)
exports('createMultipleVehicles', createMultipleVehicles)