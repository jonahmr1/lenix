Config = {}
local isActive = false

QBCore.Functions.CreateCallback('lenix_patrolvehicles:CheckIfActive', function(source, cb)
    local src = source

    if not isActive then
        TriggerEvent("lenix_patrolvehicles:server:SetActive", true)
        cb(true)
    else
        cb(false)
        TriggerClientEvent("QBCore:Notify", src, "We are already in busy with someone else", "error")
    end
end)

RegisterNetEvent('lenix_patrolvehicles:server:SetActive', function(status)
    if status ~= nil then
        isActive = status
        TriggerClientEvent('lenix_patrolvehicles:client:SetActive', -1, isActive)
    else
        TriggerClientEvent('lenix_patrolvehicles:client:SetActive', -1, isActive)
    end
end)

RegisterServerEvent("lenix_patrolvehicles:insert")
AddEventHandler('lenix_patrolvehicles:insert', function(mods, vehicle, hash, plate)
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
