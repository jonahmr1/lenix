local services <const> = require 'server/services/index'
local qb <const> = exports['qb-core']:GetCoreObject()

local bridge <const> = {
	getPlayerMoney = function(source)
		local pData = exports.qbx_core:GetPlayer(source).PlayerData
		return { money = pData.money }
	end,
	removeCash = function(source, amount)
		local player = qb.Functions.GetPlayer(source)
		player.Functions.RemoveMoney('cash', amount)
	end,
	notify = function(source, message, type)
		TriggerClientEvent('qb:Notify', source, message, type)
	end,
	getPlayerJob = function(source)
		local pData = qb.Functions.GetPlayer(source).PlayerData
		return { name = pData.job.name, grade = pData.job.grade.level }
	end,
	getPlayerGang = function(source)
		local pData = qb.Functions.GetPlayer(source).PlayerData
		return { name = pData.gang.name, grade = pData.gang.grade.level }
	end
}

lib.onPromise('sessionStatus', function()
	return services.isPreviewSessionBusy()
end)

lib.onPromise('isPlayerInAllowList', function(source, allowedList)
	return services.isPlayerBelongToPositions(source, allowedList)
end)

lib.onPromise('isPlayerNotInDisallowedList', function(source, disallowedList)
	return not services.isPlayerBelongToPositions(source, disallowedList)
end)

RegisterNetEvent('lenix_vehicles:server:setPreviewSessionBusy', services.setPreviewSessionBusy)
RegisterNetEvent('lenix_vehicles:proccess', services.proccessVehicleRegisteration)

return bridge
