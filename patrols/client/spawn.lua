local QBCore = exports['qb-core']:GetCoreObject()

local function GetVehicleConfigByModel(configName, model)
    if not Config.Vehicles[configName] then
        print("Config not found: " .. tostring(configName))
        return nil
    end

    for _, vehicleConfig in ipairs(Config.Vehicles[configName]) do
        if vehicleConfig.vehicle == model then
            return vehicleConfig
        end
    end
    return nil
end

RegisterNetEvent("patrols:SpawnVehicle")
AddEventHandler("patrols:SpawnVehicle", function(vehicleModel, configName)
    local spawnCoords = nil
    
    print("Searching for spawn coordinates for config: " .. tostring(configName))
    
    for _, interactPoint in pairs(Config.Interact) do
        if interactPoint.config == configName then
            spawnCoords = interactPoint.spawn
            print("Found spawn coords for " .. configName .. ": " .. tostring(spawnCoords.x) .. ", " .. tostring(spawnCoords.y) .. ", " .. tostring(spawnCoords.z))
            break
        end
    end
    
    if not spawnCoords then
        print("Spawn coordinates not found for config: " .. tostring(configName))
        return
    end
    
    local vehicleConfig = GetVehicleConfigByModel(configName, vehicleModel)
    
    if not vehicleConfig then 
        print("Vehicle model not found in config: " .. tostring(vehicleModel)) 
        return 
    end
    
    print("Spawning vehicle " .. vehicleModel .. " at coords: " .. tostring(spawnCoords.x) .. ", " .. tostring(spawnCoords.y) .. ", " .. tostring(spawnCoords.z))
    
    QBCore.Functions.SpawnVehicle(vehicleModel, function(veh)
        local props = QBCore.Functions.GetVehicleProperties(veh)
        local plate = vehicleConfig.plate[1] .. tostring(math.random(vehicleConfig.plate[2], vehicleConfig.plate[3]))
        SetVehicleNumberPlateText(veh, plate)
        exports[Config.FuelSystem]:SetFuel(veh, 100)
        
        if vehicleConfig.style and vehicleConfig.style.isenabled then
            SetVehicleCustomPrimaryColour(veh, vehicleConfig.style.r, vehicleConfig.style.g, vehicleConfig.style.b)
            SetVehicleCustomSecondaryColour(veh, vehicleConfig.style.r, vehicleConfig.style.g, vehicleConfig.style.b)
            
            if vehicleConfig.style.livery then
                SetVehicleLivery(veh, vehicleConfig.style.livery)
            end
        end
        
        if vehicleConfig.Registerable then
            TriggerServerEvent("patrols:AddVehicleSQL", props, vehicleModel, GetHashKey(vehicleModel), QBCore.Functions.GetPlate(veh))
        end
        
        TriggerEvent("vehiclekeys:client:SetOwner", plate)
        SetVehicleEngineOn(veh, false, false, false)
        
        if CloseMenu then
            CloseMenu()
        end
    end, spawnCoords, true)
end)