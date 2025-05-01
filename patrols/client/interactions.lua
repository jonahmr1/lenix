local function createPeds()
    if pedSpawned then return end

    ped = {} -- Initialize ped as a table
    
    for k, v in pairs(Config.Interact) do
        local current = type(v.ped) == "number" and v.ped or GetHashKey(v.ped)
        
        RequestModel(current)
        while not HasModelLoaded(current) do
            Wait(0)
        end
        
        ped[k] = CreatePed(0, current, v.coords.x, v.coords.y, v.coords.z-1, v.coords.w, false, false)
        TaskStartScenarioInPlace(ped[k], v.scenario, 0, true)
        FreezeEntityPosition(ped[k], true)
        SetEntityInvincible(ped[k], true)
        SetBlockingOfNonTemporaryEvents(ped[k], true)

    end
    pedSpawned = true
end

local function deletePeds()
    if not pedSpawned then return end
    for _, v in pairs(ped) do
        DeletePed(v)
    end
    pedSpawned = false
end

CreateThread(function()
    for i, v in pairs(Config.Interact) do
        if v.interact == 'interact' then
            local interactionGroups = {} -- Initialize an empty table for groups

            for jobName, requiredGrade in pairs(v.jobs) do
                interactionGroups[jobName] = requiredGrade -- Add each job and its grade to the groups table
            end
            exports.interact:AddInteraction({
                coords = vector3(v.coords.x, v.coords.y, v.coords.z), -- Use vector3 directly
                distance = 5.0,
                interactDst = 2.0,
                id = 'gov.garage_' .. i, -- Make the ID unique using the index
                groups = interactionGroups, -- Use the dynamically created groups table
                options = {
                    {
                        label = v.label,
                        event = "patrols:Menu",
                        args = {
                            configName = v.config
                        }
                    },
                }
            })
        elseif v.interact == 'qb_target' then
            local interactionGroups = {} -- Initialize an empty table for groups

            for jobName, requiredGrade in pairs(v.jobs) do
                interactionGroups[jobName] = requiredGrade -- Add each job and its grade to the groups table
            end
            exports['qb-target']:AddBoxZone("gov.garage_" .. i, vector3(v.coords.x, v.coords.y, v.coords.z), 3.45, 3.35, {
                name = "gov.garage_" .. i,
                minZ = v.coords.z - 1.0,
                maxZ = v.coords.z + 1.0,
            }, {
                options = {
                    {
                        type = "client",
                        action = function()
                            TriggerEvent("patrols:Menu", { configName = v.config })
                        end,
                        icon = v.icon,
                        label = v.label,
                        job = interactionGroups,
                        args = {
                            configName = v.config
                        }
                    },
                },
                distance = 2.5
            })
        else
            print("Error: Invalid interaction type for " .. tostring(v.interact) .. " at index " .. tostring(i))
        end
    end
end)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    createPeds()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    deletePeds()
end)CreateThread(function()
    Wait(1000)
        createPeds()
    end)