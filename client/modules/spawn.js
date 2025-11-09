let car
function GetVehicleConfigByModel(model) {
    for (let i = 0; i < Config.Vehicles.length; i++) {
        for (let j = 0; j < Config.Vehicles[i].length; j++) {
            if (Config.Vehicles[i][j].vehicle == model) {
                return Config.Vehicles[i][j]
            }
        }
    }
    return null
}

onNet("lenix_patrolvehicles:spawn", function(vehicleModel, spawnCoords) {
    let vehicleConfig = GetVehicleConfigByModel(vehicleModel)
    if (vehicleConfig) {
        QBCore.Functions.SpawnVehicle(vehicleModel, function(veh) {
            let props = QBCore.Functions.GetVehicleProperties(veh)
            let plate = vehicleConfig.plate[1] + math.random(vehicleConfig.plate[2], vehicleConfig.plate[3])
            SetVehicleNumberPlateText(veh, plate)
            exports[Config.FuelSystem].SetFuel(veh, 100)

            if (vehicleConfig.style && vehicleConfig.style.isenabled) {
                if (vehicleConfig.style.r && vehicleConfig.style.g && vehicleConfig.style.b) {
                    SetVehicleCustomPrimaryColour(veh, vehicleConfig.style.r, vehicleConfig.style.g, vehicleConfig.style.b)
                }
                if (vehicleConfig.style.r && vehicleConfig.style.g && vehicleConfig.style.b) {
                    SetVehicleCustomSecondaryColour(veh, vehicleConfig.style.r, vehicleConfig.style.g, vehicleConfig.style.b)
                }
                if (vehicleConfig.style.livery) {
                    SetVehicleLivery(veh, vehicleConfig.style.livery)
                    SetVehicleMod(veh, 48, vehicleConfig.style.livery, false)
                }
            }

            if (vehicleConfig.Registerable) {
                TriggerServerEvent("lenix_patrolvehicles:insert", props, vehicleModel, GetHashKey(vehicleModel), QBCore.Functions.GetPlate(veh))
            }

            TriggerEvent("vehiclekeys:client:SetOwner", plate)
            SetVehicleEngineOn(veh, false, false, false)
            car = veh
        }, spawnCoords, true)
    } 
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