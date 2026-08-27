import { cache, checkDependency, requestAnimDict, requestAnimSet } from '@overextended/ox_lib/client'
import { control, entity } from 'lenix/client'

checkDependency('ox_lib', '3.39.0', true)

let crouched: boolean = false
let handsUp: boolean = false

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
	key: 'LCONTROL',
	onEvent: () => !cache.vehicle && updateCrouchAnimation(),
})

control.on({
	event: 'press',
	key: 'X',
	onEvent: async () => {
		if (Player(cache.ped).state.isCuffed) return

		await requestAnimDict('missminuteman_1ig_2')
		handsUp ? ClearPedTasks(cache.ped) : entity.playAnim(cache.ped, 'missminuteman_1ig_2', 'handsup_base')
		handsUp = !handsUp
	},
})
