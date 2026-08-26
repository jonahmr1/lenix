import { checkDependency, hideTextUI, notify, showTextUI } from '@overextended/ox_lib/client'
import { MEGAPHONE } from 'common/config'
import { api, control, player } from 'lenix/client'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('pma-voice', '6.6.2', true)

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

	if (MEGAPHONE.vehicleModels[vehicleModel]) {
		setState.micNotBusy(true)
		return true
	}
	return MEGAPHONE.vehicleClass[vehicleClass] || false
}

const deactivateMic = () => {
	MumbleSetSubmixForServerId(PlayerId(), -1)
	api['pma-voice']?.clearProximityOverride?.()
	setState.micBusy(false)
	setState.micCurrentlyBusy(false)
	showTextUI(MEGAPHONE.locales.off)
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
				title: MEGAPHONE.locales.left,
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
			title: MEGAPHONE.locales.refused,
			type: 'error',
			duration: 5000,
		})
		return
	}

	if (getState.micNotBusy) {
		setState.micCurrentlyBusy(!getState.micCurrentlyBusy)
		if (getState.micCurrentlyBusy) {
			if (getState.micFilter) MumbleSetSubmixForServerId(PlayerId(), getState.micFilter)

			api['pma-voice']?.overrideProximityRange?.(MEGAPHONE.range, true)
			setState.micBusy(true)
			showTextUI(`J - ${MEGAPHONE.locales.on}`)
			vehicleCheckLoop()
		} else deactivateMic()
	} else
		notify({
			title: MEGAPHONE.locales.unavailable,
			type: 'error',
			duration: 3000,
		})
}

setImmediate(() => {
	const submix = CreateAudioSubmix('lenix:client:MEGAPHONE')
	setState.micFilter(submix)
	if (!submix) return

	SetAudioSubmixEffectRadioFx(submix, 0)
	SetAudioSubmixEffectParamInt(submix, 0, GetHashKey('default'), 1)
	AddAudioSubmixOutput(submix, 0)
})

control.on({
	event: 'press',
	key: MEGAPHONE.key,
	onEvent: () => toggleMegaphone()
})
