QBCore = exports['qb-core']:GetCoreObject()

Config = {}
local isActive = false

QBCore.Functions.CreateCallback('patrols:CheckIfActive', function(source, cb)
    local src = source

    if not isActive then
        TriggerEvent("patrols:server:SetActive", true)
        cb(true)
    else
        cb(false)
        TriggerClientEvent("QBCore:Notify", src, "We are already in busy with someone else", "error")
    end
end)

RegisterNetEvent('patrols:server:SetActive', function(status)
    if status ~= nil then
        isActive = status
        TriggerClientEvent('patrols:client:SetActive', -1, isActive)
    else
        TriggerClientEvent('patrols:client:SetActive', -1, isActive)
    end
end)

RegisterServerEvent("patrols:insert")
AddEventHandler('patrols:insert', function(mods, vehicle, hash, plate)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    MySQL.Async.insert('INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state) VALUES (?, ?, ?, ?, ?, ?, ?)', {
        Player.PlayerData.license,
        Player.PlayerData.citizenid,
        vehicle,
        hash,
        json.encode(mods),
        plate,
        0
    })
end)
