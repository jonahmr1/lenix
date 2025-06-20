CreateThread(function()
   print("  ____              _                      _        ")
   print(" | __ )   _   _    | |       ___   _ __   (_) __  __")
   print(" |  _ \\  | | | |   | |     / _ \\  | '_ \\  | | \\\\/ /")
   print(" | |_) | | |_| |   | |___  | __/  | | | | | |  >  < ")
   print(" |____/   \\__, |   |_____| \\___|  |_| |_| |_| /_/\\\\ ")
   print("          |___/                                     ")
end)

if GetCurrentResourceName() ~= "trplr_patrols" then
    return print("^6Changing the resource's name wont't let the resource start, ^1" .. GetCurrentResourceName() .. "^0 > ^2 trplr_patrols ^7")
end

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
