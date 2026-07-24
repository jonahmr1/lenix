local api <const> = require 'client/api/index'

local function showNotification(message, type)
	lib.triggerNuiCallback('showNotification', message, type)
end

local function refreshUIData()
	local _, players = lib.triggerPromise('lenix_bossdesk:server:getJobPlayersData')
	local _, ranks = lib.triggerPromise('lenix_bossdesk:server:getJobRanks')

	local _, budget = lib.triggerPromise('lenix_bossdesk:server:getJobBudget')
	local _, totalPlayers = lib.triggerPromise('lenix_bossdesk:server:getTotalPlayers')
	local _, activePlayers = lib.triggerPromise('lenix_bossdesk:server:getJobOnlinePlayers')

	if type(budget) == 'number' and type(totalPlayers) == 'number' and type(activePlayers) == 'number' then
		lib.triggerNuiCallback('updateData', {
			players = players,
			ranks = ranks,
			stats = {
				budget = budget,
				totalPlayers = totalPlayers,
				activePlayers = activePlayers
			}
		})
	else
		lib.fatal('Failed to fetch valid stats data')
	end
end

local function openDesk()
	local _, isBoss = lib.triggerPromise('lenix_bossdesk:server:isPlayerBoss')
	if isBoss then
		lib.triggerNuiCallback('openUI')
		refreshUIData()
		SetNuiFocus(true, true)
	else
		api.notify('Access Denied', 'error', 5000, 'You are not authorized to access the police desk.')
	end
end

local function hirePlayer(citizenid, grade, callsign)
	if api.isSelfInteraction(citizenid) then
		return showNotification('Are you kidding me?!', 'error')
	end

	local _, callback = lib.triggerPromise('lenix_bossdesk:server:hirePlayer', citizenid, grade, callsign)
	if callback[1] then
		showNotification(callback[2] or 'Employee hired successfully!', 'success')
		refreshUIData()
	else
		showNotification(callback[2] or 'Failed to hire player!', 'error')
	end
end

local function firePlayer(citizenid, reason)
	if api.isSelfInteraction(citizenid) then
		return showNotification('Bruh!', 'error')
	end

	local _, callback = lib.triggerPromise('lenix_bossdesk:server:firePlayer', citizenid, reason)
	if callback[1] then
		showNotification(callback[2] or 'Employee fired successfully!', 'success')
		refreshUIData()
	else
		showNotification(callback[2] or 'Failed to fire player!', 'error')
	end
end

local function updateReputation(citizenid, action, points)
	local _, callback = lib.triggerPromise('lenix_bossdesk:server:updateReputation', citizenid, action, points)
	if callback[1] then
		local actionText = action == "commendation" and "Commendation added" or
				action == "warning" and "Warning issued" or "Suspension applied"
		showNotification(callback[2] or actionText .. ' successfully!', 'success')
		refreshUIData()
	else
		showNotification(callback[2] or 'Failed to update reputation!', 'error')
	end
end

local function transferFunds(citizenid, reason, amount)
	local _, callback = lib.triggerPromise('lenix_bossdesk:server:transferFunds', citizenid, reason, amount)
	if callback[1] then
		showNotification(callback[2] or ('$' .. amount .. ' transferred successfully!'), 'success')
		refreshUIData()
	else
		showNotification(callback[2] or 'Transfer failed! Insufficient funds or error.', 'error')
	end
end

local function manageFunds(action, amount, reason)
	local _, callback = lib.triggerPromise('lenix_bossdesk:server:manageFunds', action, amount, reason)
	if callback[1] then
		local actionText = action == "deposit" and "deposited to" or "withdrawn from"
		showNotification(callback[2] or ('$' .. amount .. ' ' .. actionText .. ' department budget!'), 'success')
		refreshUIData()
	else
		showNotification(callback[2] or 'Budget transaction failed!', 'error')
	end
end

local function openStash()
	exports.ox_inventory:openInventory('stash', 'lenixbossdesk_managment_stash')
end

return {
	openDesk = openDesk,
	hirePlayer = hirePlayer,
	firePlayer = firePlayer,
	updateReputation = updateReputation,
	transferFunds = transferFunds,
	manageFunds = manageFunds,
	openStash = openStash
}
