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
onNet('lenix_patrolvehicles:return', function() {
    if (car !== null) {
        QBCore.Functions.Notify('Vehicle Returned Back!')
        DeleteVehicle(car)
        DeleteEntity(car)
    } else {
        QBCore.Functions.Notify('You didn\'t take a vehicle from us', 'error')
    }
})