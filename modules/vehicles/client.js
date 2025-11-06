function createSingleVehicle(settings) {
    return lib.callback.await('createSingleVehicle', null, settings)
}

function createMultipleVehicles(settings) {
    return lib.callback.await('createMultipleVehicles', null, settings)
}
exports('createSingleVehicle', createSingleVehicle)
exports('createMultipleVehicles', createMultipleVehicles)