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

exports('createSingleVehicle', createSingleVehicle)
exports('createMultipleVehicles', createMultipleVehicles)
exports('clearCreatedVehicle', clearCreatedVehicle)
exports('clearCreatedVehicles', clearCreatedVehicles)