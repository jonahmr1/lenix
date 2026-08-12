import { addKeybind, hideTextUI, notify, showTextUI, sleep } from "@overextended/ox_lib/client"
import { ResourceName } from "common/resource"
import { api, client } from "lenix/client"

const getState = {
  micNotBusy: true,
  micFilter: 0,
  micBusy: false,
  micCurrentlyBusy: false,
}

const setState = {
  micNotBusy: (state: boolean) => getState.micNotBusy = state,
  micFilter: (filter: number) => getState.micFilter = filter,
  micBusy: (state: boolean) => getState.micBusy = state,
  micCurrentlyBusy: (state: boolean) => getState.micCurrentlyBusy = state,
}

const megaphone = {
  range: 30.0,
  command: 'togglemic',
  key: 'K',
  description: "Toggle Patrol's Mic",
  locales: {
    on: 'Activated',
    off: 'Deactivated',
    left: 'You left the emergency vehicle, mic turned off!',
    refused: 'You must be in an emergency vehicle to use the patrol mic!',
    unavailable: 'Patrol mic is not available right now!',
  },
  vehicleClass: [18],
  vehicleModels: ['ambulance', 'firetruck', 'police', 'police2', 'police3']
}

const removeMicFilter = () => MumbleSetSubmixForServerId(PlayerId(), -1)

const applyMicFilter = () => {
  if (getState.micFilter) MumbleSetSubmixForServerId(PlayerId(), getState.micFilter) 
}

const isEmergencyVehicle = () => {
  const playerPed = client.player.entity()
  if (!IsPedInAnyVehicle(playerPed, false)) return

	const vehicle = GetVehiclePedIsIn(playerPed, false)
	const vehicleClass = GetVehicleClass(vehicle)
	const vehicleModel = GetEntityModel(vehicle)
	
	if (megaphone.vehicleModels[vehicleModel]) {
		setState.micNotBusy(true)
		return true
	}
	return megaphone.vehicleClass[vehicleClass] || false
}

const deactivateMic = () => {
  removeMicFilter()
  api['pma-voice']?.clearProximityOverride?.()
  setState.micBusy(false)
  setState.micCurrentlyBusy(false)
  setTimeout(() => {
		hideTextUI()
	}, 1000)
	showTextUI(megaphone.locales.off)
}

const vehicleCheckLoop =  () => {
	const interval = setInterval(() => {
		if (!getState.micBusy) return
		if (!isEmergencyVehicle()) {
			setState.micNotBusy(false)
			setState.micBusy(false)
			notify({
				title: megaphone.locales.left,
				type: 'warning',
				duration: 7500
			})
			deactivateMic()
			clearInterval(interval)
		}
	}, 500);
}

const toggleMegaphone = () => {
  if (!isEmergencyVehicle()) {
		notify({
			title: megaphone.locales.refused,
			type: 'error',
			duration: 5000
		})
    return
	}

  if (getState.micNotBusy) {
    setState.micCurrentlyBusy(!getState.micCurrentlyBusy)
    if (getState.micCurrentlyBusy) {
      applyMicFilter()
			api["pma-voice"]?.overrideProximityRange?.(megaphone.range, true)
      setState.micBusy(true)
			showTextUI(`J - ${megaphone.locales.on}`)
      vehicleCheckLoop()
		} else deactivateMic()
	} else notify({
		title: megaphone.locales.unavailable,
		type: 'error',
		duration: 3000
	})
}

const createMicFilter = () => {
  const submix = CreateAudioSubmix("lenix:client:megaphone")
  setState.micFilter(submix)
  if (!submix) return
	
	SetAudioSubmixEffectRadioFx(submix, 0)
	SetAudioSubmixEffectParamInt(submix, 0, GetHashKey('default'), 1)
	AddAudioSubmixOutput(submix, 0)
}

setImmediate(() => {
  createMicFilter()
})

addKeybind({
	name: `${ResourceName}:megaphone:toggle`,
	description: megaphone.description,
	defaultKey: megaphone.key,
	onPressed: () => toggleMegaphone()
})
