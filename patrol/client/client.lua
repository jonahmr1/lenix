local QBCore = exports['qb-core']:GetCoreObject()
local Vehicle = nil
local VehicleSpawned = false

local pedSpawned = false
Ped = {}

local function createPeds()
    if pedSpawned then return end
    
    for k, v in pairs(Config.Locations) do
        local current = type(v.ped) == "number" and v.ped or GetHashKey(v.ped)
        
        RequestModel(current)
        while not HasModelLoaded(current) do
            Wait(0)
        end
        
        Ped[k] = CreatePed(0, current, v.Coords.x, v.Coords.y, v.Coords.z-1, v.Coords.w, false, false)
        TaskStartScenarioInPlace(Ped[k], v.scenario, 0, true)
        FreezeEntityPosition(Ped[k], true)
        SetEntityInvincible(Ped[k], true)
        SetBlockingOfNonTemporaryEvents(Ped[k], true)
        
        if Config.Interaction == 'interact' then
            local coordVec3 = vec3(v.Coords.x, v.Coords.y, v.Coords.z)
            
            local groups = {}
            
            if type(v.Job) == 'table' then
                for _, jobName in ipairs(v.Job) do
                    groups[jobName] = 0
                end
            else
                groups[v.Job] = 0
            end
            
            exports.interact:AddInteraction({
                coords = coordVec3,
                distance = 5.0,
                interactDst = 2.0,
                id = k.."-garage-"..tostring(type(v.Job) == 'table' and table.concat(v.Job, "-") or v.Job),
                groups = groups,
                options = {
                    {
                        label = v.label,
                        action = function()
                            TriggerEvent('policegarage:clientOpenMenu', k)
                        end,
                    },
                }
            })
        elseif Config.Interaction == 'qb_target' then
            exports['qb-target']:AddTargetEntity(Ped[k], {
                options = {
                    {
                        type = "Client",
                        action = function()
                            TriggerEvent('policegarage:clientOpenMenu', k)
                        end,
                        icon = "fas fa-car",
                        label = v.label,
                        job = v.Job,
                    },
                },
                distance = 2
            })
        else
            print('Invalid interaction type in config.lua')
        end
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

RegisterNetEvent('policegarage:client:SpawnVehicle', function(data)
    QBCore.Functions.SpawnVehicle(data.SpawnName, function(veh)
        SetVehicleNumberPlateText(veh, "SASP"..tostring(math.random(1000, 9999)))
        exports[Config.FuelSystem]:SetFuel(veh, 100.0)
        TriggerEvent("vehiclekeys:client:SetOwner", GetVehicleNumberPlateText(veh))
        SetVehicleEngineOn(veh, true, true)
        Vehicle = veh
        VehicleSpawned = true
    end, data.SpawnCoords, true)
end)

RegisterNetEvent('policegarage:client:DeleteVehicle', function()
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

RegisterNetEvent('policegarage:clientOpenMenu', function(Current)
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
    
    for _, vehicle in pairs(Config.Locations[Current].Vehicles) do
        if QBCore.Functions.GetPlayerData().job.grade.level >= tonumber(vehicle.Grade) then
            Menu[#Menu + 1] = {
                header = vehicle.VehicleName,
                icon = 'fas fa-car',
                params = {
                    event = 'policegarage:client:SpawnVehicle',
                    args = {
                        SpawnName = vehicle.VehicleSpawnName,
                        SpawnCoords = Config.Locations[Current].SpawnCoords,
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
                event = 'policegarage:client:DeleteVehicle',
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