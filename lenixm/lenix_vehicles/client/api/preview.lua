local api <const> = require 'client/api/index'
local core <const> = require 'client/index'
local constants <const> = require 'shared/constants/index'
local kit <const> = require '@trippler/tr_kit/client'

local isInPreview = false
local camHandle = nil

local function createPreviewCam(key, netId)
	local vehicle = NetworkGetEntityFromNetworkId(netId)
	local cam = constants.settings[key].VEHICLES.preview.cam
	api.bridge.drawText.show()
	isInPreview = true

	FreezeEntityPosition(PlayerPedId(), true)
	SetVehicleUndriveable(vehicle, true)

	DoScreenFadeOut(200)
	SetTimeout(500, function()
		DoScreenFadeIn(200)
	end)

	camHandle = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", cam.coords[1], cam.coords[2], cam.coords[3],
		cam.rotation.verticalrotate, cam.rotation.horizontalrotate, cam.rotation.left_n_right, cam.fov, false, 0)
	SetCamActive(camHandle, true)
	RenderScriptCams(true, true, 2000, true, true)
end

local function clearPreviewCam(netId)
	api.bridge.drawText.hide()
	FreezeEntityPosition(PlayerPedId(), false)

	local success = kit.destroyCreatedVehicle(netId)
	if not success then lib.trace('failed to destroy the preview vehicle') end

	DoScreenFadeOut(200)
	SetTimeout(500, function()
		DoScreenFadeIn(200)
	end)
	RenderScriptCams(false, false, 2000, true, true)
	isInPreview = false
end

local function previewVehicle(key, index)
	local selectedConfig = constants.settings[key].ITEM
	local configItems = constants.config[selectedConfig]

	if not isInPreview then
		local _, isPreviewSessionBusy = lib.triggerPromise('sessionStatus')
		if isPreviewSessionBusy then
			api.bridge.notify('Preview service is currently busy, try again later', 'error')
			return
		end

		local isThePlaceClear = core.IsZoneFree(constants.settings[key].VEHICLES.preview.coords)
		if not isThePlaceClear then
			api.bridge.notify('Preview point is currently busy!', 'error')
			return
		end

		TriggerServerEvent('lenix_vehicles:server:setPreviewSessionBusy', true)

		local handle, netId = kit.createSingleVehicle({
			hash = GetHashKey(configItems[index].vehicle),
			coords = constants.settings[key].VEHICLES.preview.coords,
		})

		if handle and netId then
			createPreviewCam(key, netId)
			-- Tick implementation using CreateThread
			CreateThread(function()
				while isInPreview do
					if IsControlJustPressed(0, 177) then -- Backspace/ESC
						clearPreviewCam(netId)
						TriggerServerEvent('lenix_vehicles:server:setPreviewSessionBusy', false)
						break
					end
					Wait(0)
				end
			end)
		end
	end
end

return {
	previewVehicle = previewVehicle
}
