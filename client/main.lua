local longVoiceRange = Option.Range
local micFilter, isMicActive, isToggleOn = false, false
local playerPed = PlayerPedId()
local vehicle = GetVehiclePedIsIn(playerPed, false)
local vehicleClass = GetVehicleClass(vehicle)
local vehicleModel = GetEntityModel(vehicle)

local VehicleModels = Option.VehicleModels
local VehicleClasses = Option.VehicleClass

function isEmergencyVehicle()
    if IsPedInAnyVehicle(playerPed, false) then
        if VehicleModels[vehicleModel] then
            return true
        end
        return VehicleClasses[vehicleClass] or false
    end
    return false
end

function createMicFilter()
    micFilter = CreateAudioSubmix("PatrolMic")
    if micFilter then
        SetAudioSubmixEffectRadioFx(micFilter, 0)
        SetAudioSubmixEffectParamInt(micFilter, 0, `default`, 1)
        AddAudioSubmixOutput(micFilter, 0)
    end
end

function applyMicFilter()
    if micFilter then
        MumbleSetSubmixForServerId(PlayerId(), micFilter)
    end
end

function removeMicFilter()
    MumbleSetSubmixForServerId(PlayerId(), -1)
end

CreateThread(function()
    createMicFilter()
end)
RegisterCommand(Option.Command, function()
    TriggerEvent('patrolmic:client:toggle')
end, false)

RegisterKeyMapping(Option.Command, Option.Description, 'keyboard', Option.Key)

RegisterNetEvent('patrolmic:client:toggle', function()
    if isEmergencyVehicle() then
        isMicActive = not isMicActive
        if isMicActive then
            applyMicFilter()
            exports["pma-voice"]:overrideProximityRange(longVoiceRange, true)
            isToggleOn = true
            exports["interaction"]:showInteraction('J', 'Actived')
        else
            removeMicFilter()
            exports["pma-voice"]:clearProximityOverride()
            isToggleOn = false
            exports["interaction"]:showInteraction(nil, 'Deactivated')
            Wait(1000)
            exports["interaction"]:hideInteraction()
        end
    end
end)

CreateThread(function()
    while true do
        Wait(0)
        if isToggleOn and not IsPedInAnyVehicle(playerPed, false) then
            exports["pma-voice"]:clearProximityOverride()
            exports['qb-core']:Notify('You forget to turn off the mic, it is off now!', 'warning', 7500)
            exports["interaction"]:showInteraction(nil, 'Deactivated')
            Wait(1000)
            exports["interaction"]:hideInteraction()
            isMicActive = false
        end
    end
end)