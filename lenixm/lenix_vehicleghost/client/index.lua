local currentVehicle = 0
local vehicleAlpha <const> = 200
local pedAlpha <const> = 125

local function applyGhost(vehicle, ped)
	SetEntityAlpha(vehicle, vehicleAlpha, false)
	SetEntityAlpha(ped, pedAlpha, false)
	currentVehicle = vehicle
end

local function removeGhost(ped)
	if DoesEntityExist(currentVehicle) then
		ResetEntityAlpha(currentVehicle)
		SetEntityAlpha(currentVehicle, 255, false)
	else
		lib.info('vehicle entity does not exist')
	end
	ResetEntityAlpha(ped)
	SetEntityAlpha(ped, 255, false)
	currentVehicle = 0
end

local function throwError(message)
	error(message)
end

CreateThread(function()
	while true do
		local ped <const> = PlayerPedId()
		local vehicle <const> = GetVehiclePedIsIn(ped, false)

		if vehicle ~= 0 then
			applyGhost(vehicle, ped)
		elseif currentVehicle ~= 0 then
			removeGhost(ped)
		else
			-- Note: In the original logic, this throws an error every 50ms
			-- if the player is not in a vehicle and currentVehicle is 0.
			-- Keeping it for logic parity, but it will spam your console.
			-- throwError('something was not well analysed went wrong')
		end

		Wait(50)
	end
end)
