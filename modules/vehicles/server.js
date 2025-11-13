async function createSingleVehicle(settings) {
	const hash = settings.hash
	const preCreate = settings.preCreate ?? false
	let coords = settings.coords
	
	const response = await lib.callback.await('requestModel', 1000, -1, hash, 1000)
	if (!response) lib.console.err('failed to load the model with hash of: ' + hash)
	
	if (Array.isArray(coords)) {
		coords = { x: coords[0], y: coords[1], z: coords[2], w: coords[3] }
	}

	const handle = CreateVehicle(hash, coords.x, coords.y, coords.z, coords.w, true, true)
	
	const netId = await new Promise((resolve) => {
		const tick = setTick(() => {
			if (DoesEntityExist(handle)) {
				const netId = NetworkGetNetworkIdFromEntity(handle)
				clearTick(tick)
				resolve(netId)
			}
		})
	})
	preCreate && emitNet('tr_kit:client:preCreateVehicle', -1, netId);

	on('onResourceStop', async (resourceName) => {
		if (GetCurrentResourceName() == resourceName) {
			console.log(`${resourceName} caught stopping, clearing vehicle ${netId}`)
			clearCreatedVehicle(netId)
		}
	})

	return netId
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

function clearCreatedVehicles(netIds) {
	if (!Array.isArray(netIds)) {
		console.log(`received ${typeof netIds} instead of array, use clearCreatedVehicle for single vehicle`)
		return false
	}
	let deletedCount = 0
	for (let i = 0; i < netIds.length; i++) {
		const vehicle = NetworkGetEntityFromNetworkId(netIds[i])
		if (DoesEntityExist(vehicle)) {
			DeleteEntity(vehicle)
			deletedCount++
		}
	}
	return deletedCount > 0
}

lib.callback.register('createSingleVehicle', function(_, settings) {
	return createSingleVehicle(settings)
})

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