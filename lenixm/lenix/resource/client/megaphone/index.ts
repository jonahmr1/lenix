import { checkDependency, hideTextUI, notify, showTextUI } from '@overextended/ox_lib/client'
import { api, control, player } from 'lenix/client'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('pma-voice', '6.6.2', true)

export const CONFIG = {
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
	vehicleModels: ['ambulance', 'firetruck', 'police', 'police2', 'police3'],
} as const

const getState = {
	micNotBusy: true,
	micFilter: 0,
	micBusy: false,
	micCurrentlyBusy: false,
}

const setState = {
	micNotBusy: (state: boolean) => (getState.micNotBusy = state),
	micFilter: (filter: number) => (getState.micFilter = filter),
	micBusy: (state: boolean) => (getState.micBusy = state),
	micCurrentlyBusy: (state: boolean) => (getState.micCurrentlyBusy = state),
}

const isEmergencyVehicle = () => {
	const playerPed = player.entity()
	if (!IsPedInAnyVehicle(playerPed, false)) return

	const vehicle = GetVehiclePedIsIn(playerPed, false)
	const vehicleClass = GetVehicleClass(vehicle)
	const vehicleModel = GetEntityModel(vehicle)

	if (CONFIG.vehicleModels[vehicleModel]) {
		setState.micNotBusy(true)
		return true
	}
	return CONFIG.vehicleClass[vehicleClass] || false
}

const deactivateMic = () => {
	MumbleSetSubmixForServerId(PlayerId(), -1)
	api['pma-voice']?.clearProximityOverride?.()
	setState.micBusy(false)
	setState.micCurrentlyBusy(false)
	showTextUI(CONFIG.locales.off)
	setTimeout(() => {
		hideTextUI()
	}, 1000)
}

const vehicleCheckLoop = () => {
	const interval = setInterval(() => {
		if (!getState.micBusy) return
		if (!isEmergencyVehicle()) {
			setState.micNotBusy(false)
			setState.micBusy(false)
			notify({
				title: CONFIG.locales.left,
				type: 'warning',
				duration: 7500,
			})
			deactivateMic()
			clearInterval(interval)
		}
	}, 500)
}

const toggleMegaphone = () => {
	if (!isEmergencyVehicle()) {
		notify({
			title: CONFIG.locales.refused,
			type: 'error',
			duration: 5000,
		})
		return
	}

	if (getState.micNotBusy) {
		setState.micCurrentlyBusy(!getState.micCurrentlyBusy)
		if (getState.micCurrentlyBusy) {
			if (getState.micFilter) MumbleSetSubmixForServerId(PlayerId(), getState.micFilter)

			api['pma-voice']?.overrideProximityRange?.(CONFIG.range, true)
			setState.micBusy(true)
			showTextUI(`J - ${CONFIG.locales.on}`)
			vehicleCheckLoop()
		} else deactivateMic()
	} else
		notify({
			title: CONFIG.locales.unavailable,
			type: 'error',
			duration: 3000,
		})
}

setImmediate(() => {
	const submix = CreateAudioSubmix('lenix:client:megaphone')
	setState.micFilter(submix)
	if (!submix) return

	SetAudioSubmixEffectRadioFx(submix, 0)
	SetAudioSubmixEffectParamInt(submix, 0, GetHashKey('default'), 1)
	AddAudioSubmixOutput(submix, 0)
})

control.on({
	event: 'press',
	key: CONFIG.key,
	onEvent: () => toggleMegaphone(),
})
