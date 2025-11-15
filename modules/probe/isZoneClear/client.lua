function lib.isZoneClear(zone)
    assert(type(zone) == "table", ("zone must be a table, got %s"):format(type(zone)))

    local radius<const> = zone?.radius or 10.0
    local playerPed<const> = PlayerPedId()

    local coords
    if zone?.coords then
        local zoneCoords<const> = zone.coords
        assert(type(zoneCoords) == "table", ("zone.coords must be a table, got %s"):format(type(zoneCoords)))
        if #zoneCoords > 0 then
            coords = {x = zoneCoords[1], y = zoneCoords[2], z = zoneCoords[3]}
        else
            coords = zoneCoords
        end
    else
        local pedPosition<const> = GetEntityCoords(playerPed)
        coords = {x = pedPosition.x, y = pedPosition.y, z = pedPosition.z}
    end

    local radiusSquared<const> = radius * radius
    local includeSelf<const> = zone?.selfInclude

    for _, vehicle in ipairs(GetGamePool('CVehicle')) do
        local vehiclePos<const> = GetEntityCoords(vehicle)
        local deltaX<const>, deltaY<const>, deltaZ<const> = coords.x - vehiclePos.x, coords.y - vehiclePos.y, coords.z - vehiclePos.z
        if deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ <= radiusSquared then
            return false
        end
    end

    for _, ped in ipairs(GetGamePool('CPed')) do
        if ped and (includeSelf or ped ~= playerPed) then
            local pedPosition<const> = GetEntityCoords(ped)
            local deltaX<const>, deltaY<const>, deltaZ<const> = coords.x - pedPosition.x, coords.y - pedPosition.y, coords.z - pedPosition.z
            if deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ <= radiusSquared then
                return false
            end
        end
    end

    for _, object in ipairs(GetGamePool('CObject')) do
        local objectPos<const> = GetEntityCoords(object)
        local deltaX<const>, deltaY<const>, deltaZ<const> = coords.x - objectPos.x, coords.y - objectPos.y, coords.z - objectPos.z
        if deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ <= radiusSquared then
            return false
        end
    end

    return true
end