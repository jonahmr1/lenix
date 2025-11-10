lib.callback.register('prepareVehicle', function(handle, processedStyle) {
    exports['qb-fuel'].SetFuel(handle, 100)
    SetVehicleEngineOn(handle, false, false, false)

    if (processedStyle && !processedStyle.isDisabled) {
        SetVehicleCustomPrimaryColour(handle, processedStyle[0], processedStyle[1], processedStyle[2])
        SetVehicleCustomSecondaryColour(handle, processedStyle[0], processedStyle[1], processedStyle[2])
        SetVehicleLivery(handle, processedStyle.livery)
        SetVehicleMod(handle, 48, processedStyle.livery, false)
    }
    return true
})

async function returnVehicle(netIdsRequested) {
    const closestVehicleHandle = await lib.getPlayerClosestVehicle(5.0)
    if (!closestVehicleHandle) {
        exports['qb-core'].Notify('Could not find the vehicle you are trying to return, try to get closer to it')
        return false;
    }
    const closestVehicleNetId = NetworkGetNetworkIdFromEntity(closestVehicleHandle)
    const response = await exports.tr_kit.clearCreatedVehicle(closestVehicleNetId)
    if (!response) {
        return netIdsRequested
    }
    netIdsRequested.splice(netIdsRequested.indexOf(closestVehicleNetId), 1)
    exports['qb-core'].Notify('Vehicle returned successfully')
    return netIdsRequested
}

onNet('lenix_vehicle:client:addReturnOption', (netId) => {
  netIdsRequested.unshift(netId)
})