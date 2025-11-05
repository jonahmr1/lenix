RegisterServerEvent('lenix_patrolvehicles:charge', function(data)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    local steamname = GetPlayerName(src)

    if Player.PlayerData.money.cash >= data.price then
        TriggerClientEvent("lenix_patrolvehicles:spawn", src, data.vehicle, data.spawn)
        if data.chargeable then
            Player.Functions.RemoveMoney("cash", data.price)
        end
        TriggerClientEvent('QBCore:Notify', src, 'Vehicle Successfully Bought', "success")

        if discord and discord['webhook'] then
            DiscordLog(discord['webhook'],
                'New Vehicle Bought By: **' ..
                steamname ..
                '** ID: **' .. source .. '** Bought: **' .. data.vehiclename .. '** For: **' .. data.price .. '$**',
                14177041)
        end
    else
        TriggerClientEvent('QBCore:Notify', src, 'You Don\'t Have Enough Money !', "error")
    end
end)
