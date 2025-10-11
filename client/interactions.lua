ped = {}

local function deletePeds()
    if not pedSpawned then return end
    for _, v in pairs(ped) do
        DeletePed(v)
    end
    pedSpawned = false
end

CreateThread(function()
    if pedSpawned then return end
    
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

    for i, v in pairs(Config.Interact) do
        
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
                    icon = v.icon,
                    label = v.label,
                    job = interactionGroups,
                    action = function()
                        TriggerEvent("lenix_patrolvehicles:menu", v)
                    end,
                },
            },
            distance = v.distance,
        })
    end
end)

CreateThread(function()
    if GetResourceState(GetCurrentResourceName()) == 'stopping' then
        deletePeds()
    end
end)