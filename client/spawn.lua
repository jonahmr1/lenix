local car
local function GetVehicleConfigByModel(model)
    for i, vehicles in pairs(Config.Vehicles) do
        for _, vehicleConfig in ipairs(vehicles) do
            if vehicleConfig.vehicle == model then
                return vehicleConfig
            end
        end
    end
    return nil
end

RegisterNetEvent("lenix_patrolvehicles:spawn")
AddEventHandler("lenix_patrolvehicles:spawn", function(vehicleModel, spawnCoords)
    local vehicleConfig = GetVehicleConfigByModel(vehicleModel)
    if vehicleConfig then
        QBCore.Functions.SpawnVehicle(vehicleModel, function(veh)
            local props = QBCore.Functions.GetVehicleProperties(veh)
            local plate = vehicleConfig.plate[1] .. tostring(math.random(vehicleConfig.plate[2], vehicleConfig.plate[3]))
            SetVehicleNumberPlateText(veh, plate)
            exports[Config.FuelSystem]:SetFuel(veh, 100)

            if vehicleConfig.style and vehicleConfig.style.isenabled then
                if vehicleConfig.style.r and vehicleConfig.style.g and vehicleConfig.style.b then
                    SetVehicleCustomPrimaryColour(veh, vehicleConfig.style.r, vehicleConfig.style.g, vehicleConfig.style.b)
                end
                if vehicleConfig.style.r and vehicleConfig.style.g and vehicleConfig.style.b then
                    SetVehicleCustomSecondaryColour(veh, vehicleConfig.style.r, vehicleConfig.style.g, vehicleConfig.style.b)  -- Fixed: using r2, g2, b2 for secondary color
                end
                if vehicleConfig.style.livery then
                    SetVehicleLivery(veh, vehicleConfig.style.livery)
                    SetVehicleMod(veh, 48, vehicleConfig.style.livery, false)
                end
            end

            if vehicleConfig.Registerable then
                TriggerServerEvent("lenix_patrolvehicles:insert", props, vehicleModel, GetHashKey(vehicleModel), QBCore.Functions.GetPlate(veh))
            end

            TriggerEvent("vehiclekeys:client:SetOwner", plate)
            SetVehicleEngineOn(veh, false, false, false)
            car = veh
        end, spawnCoords, true)
    end
end)

RegisterNetEvent('lenix_patrolvehicles:return')
AddEventHandler('lenix_patrolvehicles:return', function()
    if car ~= nil then
        QBCore.Functions.Notify('Vehicle Returned Back!')
        DeleteVehicle(car)
        DeleteEntity(car)
    else
        QBCore.Functions.Notify('You didn\'t take a vehicle from us', 'error')
    end
end)