onNet('tr_kit:client:preCreateVehicle', (netId) => {
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
});

function createSingleVehicle(settings) {
	return lib.callback.await('createSingleVehicle', null, settings)
}

function createMultipleVehicles(settings) {
	return lib.callback.await('createMultipleVehicles', null, settings)
}

function clearCreatedVehicle(vehicle) {
	return lib.callback.await('clearCreatedVehicle', null, vehicle)
}

function clearCreatedVehicles(vehicles) {
	return lib.callback.await('clearCreatedVehicles', null, vehicles)
}

lib.callback.register('requestModel', function (modelHash, timeout) {
	return lib.requestModel(modelHash, timeout)
})

exports('createSingleVehicle', createSingleVehicle)
exports('createMultipleVehicles', createMultipleVehicles)
exports('clearCreatedVehicle', clearCreatedVehicle)
exports('clearCreatedVehicles', clearCreatedVehicles)