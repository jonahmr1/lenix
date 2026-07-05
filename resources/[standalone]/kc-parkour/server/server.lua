--[[LoRo Store
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
]]
local lastEventAt = {}

local function now()
    return GetGameTimer()
end

local function rateLimit(source, eventName, interval)
    interval = interval or 80
    lastEventAt[source] = lastEventAt[source] or {}

    local currentTime = now()
    local previous = lastEventAt[source][eventName] or 0
    if currentTime - previous < interval then
        return false
    end

    lastEventAt[source][eventName] = currentTime
    return true
end

local function isNumber(value)
    return type(value) == "number"
end

local function isVector3(value)
    return type(value) == "vector3" or (type(value) == "table" and isNumber(value.x) and isNumber(value.y) and isNumber(value.z))
end

local function getRecipients(source)
    if Config.SendToAllPlayers then
        return GetPlayers()
    end

    local sourcePed = GetPlayerPed(source)
    if not sourcePed or sourcePed == 0 then
        return GetPlayers()
    end

    local sourceCoords = GetEntityCoords(sourcePed)
    local recipients = {}
    for _, player in ipairs(GetPlayers()) do
        local target = tonumber(player)
        local targetPed = GetPlayerPed(target)
        if targetPed and targetPed ~= 0 then
            local targetCoords = GetEntityCoords(targetPed)
            if #(sourceCoords - targetCoords) <= 150.0 then
                recipients[#recipients + 1] = target
            end
        end
    end

    return recipients
end

local function relayToNearby(source, eventName, ...)
    for _, target in ipairs(getRecipients(source)) do
        TriggerClientEvent(eventName, target, ...)
    end
end

local function validNetId(netId)
    return isNumber(netId) and netId > 0
end

RegisterNetEvent("kc-parkour:syncMove", function(netId, coords, moveData, forward, heightDistance, frontDistance, extraA, extraB, direction, ...)
    local src = source
    if not rateLimit(src, "syncMove") or not validNetId(netId) or not isVector3(coords) or type(moveData) ~= "table" then
        return
    end

    relayToNearby(src, "kc-parkour:syncMove", src, netId, coords, moveData, forward, heightDistance, frontDistance, extraA, extraB, direction)
end)

RegisterNetEvent("kc-parkour:syncMoveHand", function(netId, coords, moveData, heightDistance, handData, direction, ...)
    local src = source
    if not rateLimit(src, "syncMoveHand") or not validNetId(netId) or not isVector3(coords) or type(moveData) ~= "table" then
        return
    end

    relayToNearby(src, "kc-parkour:syncMoveHand", src, netId, coords, moveData, heightDistance, handData, direction)
end)

RegisterNetEvent("kc-parkour:syncMoveLedge", function(netId, coords, heading, ...)
    local src = source
    if not rateLimit(src, "syncMoveLedge") or not validNetId(netId) or not isVector3(coords) or not isNumber(heading) then
        return
    end

    relayToNearby(src, "kc-parkour:syncMoveLedge", src, netId, coords, heading)
end)

RegisterNetEvent("kc-parkour:syncMoveSideways", function(netId, direction, dict, anim, ...)
    local src = source
    if not rateLimit(src, "syncMoveSideways") or not validNetId(netId) or not isNumber(direction) or type(dict) ~= "string" or type(anim) ~= "string" then
        return
    end

    relayToNearby(src, "kc-parkour:syncMoveSideways", src, netId, direction, dict, anim)
end)

RegisterNetEvent("kc-parkour:tacklePlayer", function(x, y, z, targetNetId, ...)
    local src = source
    if not rateLimit(src, "tacklePlayer", 250) or not isNumber(x) or not isNumber(y) or not isNumber(z) or not validNetId(targetNetId) then
        return
    end

    relayToNearby(src, "kc-parkour:tacklePlayer", x, y, z, targetNetId)
end)

AddEventHandler("playerDropped", function()
    lastEventAt[source] = nil
end)

