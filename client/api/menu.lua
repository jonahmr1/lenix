local api <const> = require 'client/api/index'
local core <const> = require 'client/index'
local constants <const> = require 'shared/constants/index'
local utils <const> = require 'shared/utils/index'
local preview <const> = require 'client/api/preview'

local function isPlayerAllowed(processedItem)
	local allowedTargets = processedItem.allowed
	local disallowedTargets = processedItem.disallowed

	local inAllowList = lib.triggerPromise('isPlayerInAllowList', allowedTargets)
	local notInDisallowList = lib.triggerPromise('isPlayerNotInDisallowedList', disallowedTargets)

	return notInDisallowList and inAllowList
end

local function listMenu(key)
	-- Logic implementation based on your TS structure
	-- ... (Omitted for brevity, but follows the pattern below)
end

local function mainMenu(key)
	local menu = utils.tableFiller(constants.settings[key].MENU, constants.settings._DEFAULT.MENU)
	local options = {
		{
			title = menu.main.browse.title,
			icon = menu.main.browse.icon,
			onClick = function()
				listMenu(key)
			end
		}
	}

	if not constants.settings[key].VEHICLES.preview.isDisabled then
		table.insert(options, {
			title = menu.main.preview.title,
			icon = menu.main.preview.icon,
			onClick = function()
				-- require local to avoid circular dep if necessary
				local menuMod = require 'client/api/menu'
				menuMod.previewMenu(key)
			end
		})
	end

	local main = {
		id = 'main_menu',
		header = menu.main.header
	}
	api.bridge.menu.open(main, options)
end

local function previewMenu(key)
	local options = {}
	local itemConfig = constants.settings[key].ITEM
	local configItems = constants.config[itemConfig]
	local menu = utils.tableFiller(constants.settings[key].MENU, constants.settings._DEFAULT.MENU)

	table.insert(options, {
		title = menu.subMain['return'].title,
		icon = menu.subMain['return'].icon,
		onClick = function()
			mainMenu(key)
		end
	})

	if configItems then
		for index, item in ipairs(configItems) do
			local image = utils.tableFiller(constants.config._DEFAULT.image, item.image)
			local vehName = api.bridge.getVehicles(item.vehicle).name
			table.insert(options, {
				title = menu.subMain.preview.title .. " " .. vehName,
				icon = menu.subMain.preview.icon,
				image = image,
				onClick = function()
					preview.previewVehicle(key, index)
				end
			})
		end
	end

	api.bridge.menu.open({ id = 'preview_menu', header = menu.subMain.list.title }, options)
end

return {
	mainMenu = mainMenu,
	previewMenu = previewMenu
}
