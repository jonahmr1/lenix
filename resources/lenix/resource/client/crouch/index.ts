import { addKeybind, cache, requestAnimSet } from '@overextended/ox_lib/client'

let crouched: false = false

const updateCrouchAnimation = async () => {
	await requestAnimSet('move_Ped_crouched')
	if (crouched) {
		ResetPedMovementClipset(cache.ped, 1.0)
		ResetPedWeaponMovementClipset(cache.ped)
		ResetPedStrafeClipset(cache.ped)
		SetPedStealthMovement(cache.ped, false, 'DEFAULT_ACTION')
	} else {
		SetPedMovementClipset(cache.ped, 'move_Ped_crouched', 1.0)
		SetPedStrafeClipset(cache.ped, 'move_Ped_crouched_strafing')
	}
	RemoveAnimSet('move_ped_crouched')
}

addKeybind({
	name: 'crouch',
	description: 'Crouch',
	defaultKey: 'LCONTROL',
	onReleased: () => {
		if (cache.vehicle) return

		updateCrouchAnimation()
	},
})
