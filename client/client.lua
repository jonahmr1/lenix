local QBCore = exports['qb-core']:GetCoreObject()
local Vehicle = nil
local VehicleSpawned = false
local pedSpawned = false
local settings = require 'config/client'
Ped = {}

local function createPeds()
    if pedSpawned then return end
    
    for k, v in pairs(settings.locations) do
        local current = type(v.ped) == "number" and v.ped or GetHashKey(v.ped)
        
        RequestModel(current)
        while not HasModelLoaded(current) do
            Wait(0)
        end
        
        Ped[k] = CreatePed(0, current, v.coords.x, v.coords.y, v.coords.z-1, v.coords.w, false, false)
        TaskStartScenarioInPlace(Ped[k], v.scenario, 0, true)
        FreezeEntityPosition(Ped[k], true)
        SetEntityInvincible(Ped[k], true)
        SetBlockingOfNonTemporaryEvents(Ped[k], true)
        
        exports['qb-target']:AddTargetEntity(Ped[k], {
            options = {
                {
                    type = "Client",
                    action = function()
                        TriggerEvent('lenix_patrolservice:clientOpenMenu', k)
                    end,
                    icon = "fas fa-car",
                    label = v.label,
                    job = v.job,
                },
            },
            distance = 2
        })
    end
    pedSpawned = true
end

local function deletePeds()
    if not pedSpawned then return end
    for _, v in pairs(Ped) do
        DeletePed(v)
    end
    pedSpawned = false
end

RegisterNetEvent('lenix_patrolservice:client:SpawnVehicle', function(data)
    QBCore.Functions.SpawnVehicle(data.SpawnName, function(veh)
        SetVehicleNumberPlateText(veh, "SASP"..tostring(math.random(1000, 9999)))
        exports['qb-fuel']:SetFuel(veh, 100.0)
        TriggerEvent("vehiclekeys:client:SetOwner", GetVehicleNumberPlateText(veh))
        SetVehicleEngineOn(veh, true, true)
        Vehicle = veh
        VehicleSpawned = true
    end, data.spawnCoords, true)
end)

RegisterNetEvent('lenix_patrolservice:client:DeleteVehicle', function()
    if Vehicle ~= nil then
        DeleteVehicle(Vehicle)
        DeleteEntity(Vehicle)
        VehicleSpawned = false
    elseif IsPedInAnyVehicle(PlayerPedId()) then
        DeleteVehicle(GetVehiclePedIsIn(PlayerPedId(), false))
        DeleteEntity(GetVehiclePedIsIn(PlayerPedId(), false))
        VehicleSpawned = false
    else
        QBCore.Functions.Notify('You need to be in any vehicle!', 'error', 5000)
    end
end)

RegisterNetEvent('lenix_patrolservice:clientOpenMenu', function(Current)
    local Menu = {
        {
            header = 'Government Garage',
            isMenuHeader = true,
            icon = 'fas fa-car',
        },
        {
            header = 'Close Menu',
            icon = 'fas fa-close',
            params = {
                event = 'qb-menu:closeMenu',
            },
        },
    }
    
    for _, vehicle in pairs(settings.locations[Current].vehicles) do
        if QBCore.Functions.GetPlayerData().job.grade.level >= tonumber(vehicle.grade) then
            Menu[#Menu + 1] = {
                header = vehicle.vehicleName,
                icon = 'fas fa-car',
                params = {
                    event = 'lenix_patrolservice:client:SpawnVehicle',
                    args = {
                        SpawnName = vehicle.vehicleSpawnName,
                        spawnCoords = settings.locations[Current].spawnCoords,
                    },
                }
            }
        end
    end
    
    if VehicleSpawned == true then
        Menu[#Menu + 1] = {
            header = 'Store Vehicle',
            icon = 'fas fa-ban',
            params = {
                event = 'lenix_patrolservice:client:DeleteVehicle',
            }
        }
    end
    
    Wait(500)
    exports['qb-menu']:openMenu(Menu)
end)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    createPeds()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    deletePeds()
end)