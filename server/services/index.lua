local constants <const> = require 'shared/constants/index'
local utils <const> = require 'shared/utils/index'
local api -- Forward declaration for bridge access

local isPreviewBusy = false

local function isPlayerBelongToPositionOf(targeted, current)
	return targeted == current
end

local function isPlayerBelongToPositions(source, targetedPositions)
	if not targetedPositions then return true end
	api = require 'server/api/index'

	local isBelongJob = false
	local isBelongGang = false

	if targetedPositions.job then
		-- Get the first key of the job table
		local targetedJobName = next(targetedPositions.job)
		local playerJob = api.getPlayerJob(source).name
		isBelongJob = isPlayerBelongToPositionOf(targetedJobName, playerJob)
	else
		isBelongJob = true -- Not restricted by job
	end

	if targetedPositions.gang then
		local targetedGangName = next(targetedPositions.gang)
		local playerGang = api.getPlayerGang(source).name
		isBelongGang = isPlayerBelongToPositionOf(targetedGangName, playerGang)
	else
		isBelongGang = true -- Not restricted by gang
	end

	return isBelongJob and isBelongGang
end

local function setPreviewSessionBusy(status)
	isPreviewBusy = status
	if isPreviewBusy then
		local currentSource = source
		AddEventHandler('playerDropped', function()
			if source == currentSource then
				isPreviewBusy = false
			end
		end)
	end
end

local function spawnBoughtVehicle(src, register, systemKey, index)
	-- Logic to handle persistent vehicle spawning/DB would go here
	-- Returning a mock netId as per your TS logic for now
	return 12345
end

local function proccessVehicleRegisteration(systemKey, configIndex)
	local src <const> = source
	api = require 'server/api/index'

	local pMoney = api.getPlayerMoney(src)
	local selectedConfig = constants.settings[systemKey].ITEM
	local item = utils.tableFiller(constants.config._DEFAULT, constants.config[selectedConfig][configIndex])

	if item.registerable then
		if pMoney.money.cash >= item.price then
			local netId = spawnBoughtVehicle(src, true, systemKey, configIndex)
			if netId then
				api.removeCash(src, item.price)
				api.notify(src, 'Vehicle Successfully Bought', 'success')
			else
				lib.trace('Failed to spawn bought car for: ' .. src)
			end
		else
			api.notify(src, "You Don't Have Enough Money!", 'error')
		end
	else
		-- Non-registerable (free/garage) spawn
		local netId = spawnBoughtVehicle(src, false, systemKey, configIndex)
		if netId then
			api.notify(src, 'Vehicle Delivered', 'success')
		end
	end
end

return {
	isPreviewSessionBusy = function() return isPreviewBusy end,
	setPreviewSessionBusy = setPreviewSessionBusy,
	proccessVehicleRegisteration = proccessVehicleRegisteration,
	isPlayerBelongToPositions = isPlayerBelongToPositions
}
