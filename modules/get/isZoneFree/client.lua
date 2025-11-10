--- Check if a zone/space is free from entities
--- Uses GetGamePool which is the standard production method
--- @param zone table - Zone configuration
---   - coords: vector3 - Center coordinates (required)
---   - radius: number - Radius to check (optional, default: 2.0)
--- @return boolean - true if zone is free, false if occupied
function lib.isZoneFree(zone)
    local coords = {x = zone.coords[1], y = zone.coords[2], z = zone.coords[3]}
    local radius = zone.radius or 2.0
    local radiusSquared = radius * radius -- Use squared distance to avoid expensive sqrt
    
    local playerPed = PlayerPedId()
    
    -- Check vehicles first (most common use case for spawn blocking)
    local vehicles = GetGamePool('CVehicle')
    for i = 1, #vehicles do
        local vehCoords = GetEntityCoords(vehicles[i])
        local dx = coords.x - vehCoords.x
        local dy = coords.y - vehCoords.y
        local dz = coords.z - vehCoords.z
        local distSquared = dx * dx + dy * dy + dz * dz
        
        if distSquared <= radiusSquared then
            return false -- Zone occupied by vehicle
        end
    end
    
    -- Check peds/players
    local peds = GetGamePool('CPed')
    for i = 1, #peds do
        local ped = peds[i]
        if ped ~= playerPed then -- Ignore self
            local pedCoords = GetEntityCoords(ped)
            local dx = coords.x - pedCoords.x
            local dy = coords.y - pedCoords.y
            local dz = coords.z - pedCoords.z
            local distSquared = dx * dx + dy * dy + dz * dz
            
            if distSquared <= radiusSquared then
                return false -- Zone occupied by ped
            end
        end
    end
    
    -- Check objects (props, debris, etc.)
    local objects = GetGamePool('CObject')
    for i = 1, #objects do
        local objCoords = GetEntityCoords(objects[i])
        local dx = coords.x - objCoords.x
        local dy = coords.y - objCoords.y
        local dz = coords.z - objCoords.z
        local distSquared = dx * dx + dy * dy + dz * dz
        
        if distSquared <= radiusSquared then
            return false -- Zone occupied by object
        end
    end
    
    return true -- Zone is free
end

-- Example usage:
--[[
    -- Check if parking spot is free
    local isFree = lib.isZoneFree({
        coords = vector3(100.0, 200.0, 30.0),
        radius = 3.0
    })
    
    -- Check before spawning vehicle
    if lib.isZoneFree({ coords = spawnCoords, radius = 4.0 }) then
        -- Safe to spawn
        SpawnVehicle(model, spawnCoords)
    else
        print("Spawn blocked - try another location")
    end
    
    -- Quick 2m check around a point
    local isFree = lib.isZoneFree({ coords = targetCoords })
]]