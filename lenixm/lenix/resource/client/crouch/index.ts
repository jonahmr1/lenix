import { cache, checkDependency, requestAnimSet } from '@overextended/ox_lib/client'
import { control } from 'lenix/client'

checkDependency('ox_lib', '3.39.0', true)

let crouched: boolean = false

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
	crouched = !crouched
}

control.on({
	event: 'press',
	key: 'LEFT CTRL',
	onEvent: () => !cache.vehicle && updateCrouchAnimation()
})
