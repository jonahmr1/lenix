let deletedVehicles = new Set()

async function createSingleVehicle(source, settings) {
	return await lib.callback.await('createSingleVehicle', null, source, settings)
}

async function createMultipleVehicles(source, vehicles, defaultSettings) {
	const promises = vehicles.map(vehicle => {
		createSingleVehicle(source, {
			hash: vehicle?.hash || defaultSettings.hash,
			coords: vehicle.coords,
			preCreate: vehicle?.preCreate || defaultSettings?.preCreate,
			warp: vehicle?.warp || defaultSettings?.warp,
			plate: vehicle?.plate || defaultSettings?.plate,
			giveKey: vehicle?.giveKey || defaultSettings?.giveKey,
			setFuelAmount: vehicle?.setFuelAmount || defaultSettings?.setFuelAmount,
			engine: vehicle?.engine || defaultSettings?.engine,
			customize: vehicle?.customize || defaultSettings?.customize,
			register: vehicle?.register || defaultSettings?.register,
		})}
	)
	return await Promise.all(promises)
}

async function clearCreatedVehicle(netId) {
	if (typeof netId !== 'number') {
		lib.console.trace(`received ${typeof netId} instead of a number, if you passed an array of number to delete multiple vehicles, please use clearCreatedVehicles instead of clearCreatedVehicle`)
		return false
	}
	if (deletedVehicles.has(netId)) {
		lib.console.trace(`Vehicle ${netId} already deleted, skipping`)
		return true
	}
	const [vehicle, existingNetId] = await lib.awaitInstanceExisting(null, netId);
	if (!vehicle || vehicle === false) {
		lib.console.info(`Vehicle ${netId} does not exist`);
		return false;
	}
	DeleteEntity(vehicle)
	deletedVehicles.add(existingNetId)
	return true
}

async function clearCreatedVehicles(netIds) {
	if (!Array.isArray(netIds)) {
		lib.console.trace(`received ${typeof netIds} instead of array, use clearCreatedVehicle for single vehicle`)
		return false
	}
	for (let i = 0; i < netIds.length; i++) {
		await createSingleVehicle(netIds[i])
	}
	return true
}

lib.callback.register('createMultipleVehicles', function(source, settings, defaultSettings) {
	return createMultipleVehicles(source, settings, defaultSettings)
})

lib.callback.register('clearCreatedVehicle', function(_, vehicle) {
	return clearCreatedVehicle(vehicle)
})

lib.callback.register('clearCreatedVehicles', function(_, vehicles) {
	return clearCreatedVehicles(vehicles)
})

lib.callback.register('registerCreatedVehicle', async (source, model, hash, mods, plate) => {
	const response = await Bridge.SQL_Register(source, model, hash, mods, plate)
	if (!response) {
		lib.console.trace('Failed to register the vehicle for the player with the id of: ' + source)
	}
})

exports('createSingleVehicle', createSingleVehicle)
exports('createMultipleVehicles', createMultipleVehicles)
exports('clearCreatedVehicle', clearCreatedVehicle)
exports('clearCreatedVehicles', clearCreatedVehicles)