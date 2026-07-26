local takeThePackage <const> = require 'client/modules/index'
local config <const> = require 'shared/constants/index'

local function progress(label)
	return exports.ox_lib:progressBar({
		duration = 1000,
		label = label,
		useWhileDead = false,
		canCancel = true,
		disable = {
			move = true,
			car = true,
			combat = true
		},
	})
end

local function addLocalEntity(prop, target)
	exports.ox_target:addLocalEntity(prop, {
		{
			name = prop,
			icon = target.icon,
			label = target.label,
			distance = target.distance,
			onSelect = takeThePackage
		}
	})
end

local function addBoxZone(pedCoords, takeTask, isPlayerFree, abortTask)
	exports.ox_target:addBoxZone({
		coords = vec3(pedCoords[1], pedCoords[2], pedCoords[3]),
		size = vec3(1, 1, 2),
		debug = false,
		options = {
			{
				label = config.settings.ped.take.targetLabel,
				icon = config.settings.ped.take.targetIcon,
				onSelect = takeTask,
				canInteract = function() return isPlayerFree end,
				distance = config.settings.ped.take.distance,
			},
			{
				label = config.settings.ped.abort.targetLabel,
				icon = config.settings.ped.abort.targetIcon,
				onSelect = abortTask,
				canInteract = function() return not isPlayerFree end,
				distance = config.settings.ped.abort.distance,
			},
		}
	})
end

local function removeLocalEntity(prop)
	exports.ox_target:removeLocalEntity(prop, prop)
end

local function notify(title, subTitle, type, duration)
	exports.qbx_core:Notify(title, subTitle, type, duration)
end

local bridge <const> = {
	progress = progress,
	addLocalEntity = addLocalEntity,
	addBoxZone = addBoxZone,
	removeLocalEntity = removeLocalEntity,
	notify = notify
}

return bridge
