local function isPlayerBoss()
    return lib.callback.await('tr_bossdesk:server:isPlayerBoss', GetPlayerServerId(cache.ped))
end

---@return table <id, name, badge, rank, status>
local function getAllPlayers()
    return lib.callback.await('tr_bossdesk:server:getJobPlayersData')
end

local function getJobBudget()
    return lib.callback.await('tr_bossdesk:server:getJobBudget')
end

local function getTotalPlayers()
    return lib.callback.await('tr_bossdesk:server:getTotalPlayers')
end

local function getJobOnlinePlayers(players)
    return lib.callback.await('tr_bossdesk:server:getJobOnlinePlayers', false, players)
end

local function getJobRanks()
    return lib.callback.await('tr_bossdesk:server:getJobRanks')
end

local function refreshUIData()
    SendNUIMessage({
        action = 'updateData',
        players = getAllPlayers(),
        ranks = getJobRanks(),
        stats = {
            budget = getJobBudget(),
            totalPlayers = getTotalPlayers(),
            activePlayers = getJobOnlinePlayers(getAllPlayers())
        }
    })
end

local function showNotification(message, type)
    SendNUIMessage({
        action = 'showNotification',
        message = message,
        type = type
    })
end

local function isSelfInteraction(citizenid)
    return lib.callback.await('tr_bossdesk:server:isSelfInteraction', false, citizenid)
end

local function openDesk()
    if isPlayerBoss() then
        SendNUIMessage({
            action = 'openUI',
        })
        refreshUIData()
        SetNuiFocus(true, true)
    else
        lib.notify({
            title = 'Access Denied',
            description = 'You are not authorized to access the police desk.',
            type = 'error'
        })
    end
end

RegisterNUICallback('hirePlayer', function(data, cb)
    if isSelfInteraction(data.citizenid) then
        return showNotification('Are you kidding me?!', 'error')
    end
    lib.callback('tr_bossdesk:server:hirePlayer', false, function(success, message)
        if success then
            showNotification(message or 'Employee hired successfully!', 'success')
            refreshUIData()
        else
            showNotification(message or 'Failed to hire player!', 'error')
            cb(false)
        end
    end, data.citizenid, data.rank, data.badge)

    cb('ok')
end)

RegisterNUICallback('firePlayer', function(data, cb)
    if isSelfInteraction(data.citizenid) then
        showNotification('Bruh!', 'error')
        cb(true)
        return
    end
    lib.callback('tr_bossdesk:server:firePlayer', false, function(success, message)
        if success then
            showNotification(message or 'Employee fired successfully!', 'success')
            refreshUIData()
        else
            showNotification(message or 'Failed to fire player!', 'error')
            cb(false)
        end
    end, data.citizenid, data.reason)

    cb('ok')
end)

RegisterNUICallback('updateReputation', function(data, cb)
    lib.callback('tr_bossdesk:server:updateReputation', false, function(success, message)
        if success then
            local actionText = data.action == "commendation" and "Commendation added" or
                data.action == "warning" and "Warning issued" or
                "Suspension applied"
            showNotification(message or actionText .. ' successfully!', 'success')
            refreshUIData()
        else
            showNotification(message or 'Failed to update reputation!', 'error')
            cb(false)
        end
    end, data.citizenid, data.action, data.points)

    cb('ok')
end)

RegisterNUICallback('transferFunds', function(data, cb)
    lib.callback('tr_bossdesk:server:transferFunds', false, function(success, message)
        if success then
            showNotification(message or '$' .. data.amount .. ' transferred successfully!', 'success')
            refreshUIData()
        else
            showNotification(message or 'Transfer failed! Insufficient funds or error.', 'error')
            cb(false)
        end
    end, data.citizenid, data.type, data.amount)

    cb('ok')
end)

RegisterNUICallback('manageFunds', function(data, cb)
    lib.callback('tr_bossdesk:server:manageFunds', false, function(success, message)
        if success then
            local actionText = data.action == "deposit" and "deposited to" or "withdrawn from"
            showNotification(message or '$' .. data.amount .. ' ' .. actionText .. ' department budget!', 'success')
            refreshUIData()
        else
            showNotification(message or 'Budget transaction failed!', 'error')
        end
    end, data.action, data.amount, data.description)

    cb('ok')
end)

RegisterNUICallback('openStash', function(data, cb)
    exports.ox_inventory:openInventory('stash', GetCurrentResourceName() .. '_managment_stash')
    cb('ok')
end)

RegisterNUICallback('closeUI', function(data, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'closeUI'
    })
    cb('ok')
end)

RegisterNetEvent('tr_bossdesk:client:openDesk', openDesk)

RegisterCommand('policedesk', function()
    TriggerEvent('tr_bossdesk:client:openDesk')
end)

exports('OpenDesk', openDesk)