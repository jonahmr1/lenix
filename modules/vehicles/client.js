function preCreateVehicle(netId) {
	const entity = NetworkGetEntityFromNetworkId(netId);

	for (let i = 0; i < 10; i++) {
		setTimeout(() => {
			SetEntityAlpha(entity, 51, false);
			setTimeout(() => {
				SetEntityAlpha(entity, 102, false);
			}, 100);
		}, i * 200);
	}
	
	setTimeout(() => {
		ResetEntityAlpha(entity);
	}, 2000);
}

async function createSingleVehicle(settings) {
	const hash = settings.hash
	const preCreate = settings.preCreate ?? false
	let coords = settings.coords
	
	const response = await lib.requestModel(hash, 1000)
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
	preCreate && preCreateVehicle(netId);

	on('onResourceStop', async (resourceName) => {
		if (GetCurrentResourceName() == resourceName) {
			console.log(`${resourceName} caught stopping, clearing vehicle ${netId}`)
			clearCreatedVehicle(netId)
		}
	})
	return [handle, netId]
}

lib.callback.register('createSingleVehicle', async (settings) => {
	return await createSingleVehicle(settings)
})

async function createMultipleVehicles(settings) {
	return await lib.callback.await('createMultipleVehicles', null, settings)
}

async function clearCreatedVehicle(netId) {
	return await lib.callback.await('clearCreatedVehicle', null, netId)
}

async function clearCreatedVehicles(netId) {
	return await lib.callback.await('clearCreatedVehicles', null, netId)
}

exports('createSingleVehicle', createSingleVehicle)
exports('createMultipleVehicles', createMultipleVehicles)
exports('clearCreatedVehicle', clearCreatedVehicle)
exports('clearCreatedVehicles', clearCreatedVehicles)