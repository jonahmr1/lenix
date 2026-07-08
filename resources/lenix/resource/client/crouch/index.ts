import { addKeybind, cache, requestAnimSet } from '@overextended/ox_lib/client'

AddStateBagChangeHandler(
	'crouch',
	`player:${cache.serverId}`,
	async (_bagName, _key, value: boolean, _reserved, replicated) => {
		if (replicated) return

		await requestAnimSet('move_Ped_crouched')

		if (!value) {
			ResetPedMovementClipset(cache.ped, 1.0)
			ResetPedWeaponMovementClipset(cache.ped)
			ResetPedStrafeClipset(cache.ped)
			SetPedStealthMovement(cache.ped, false, 'DEFAULT_ACTION')
		} else {
			SetPedMovementClipset(cache.ped, 'move_Ped_crouched', 1.0)
			SetPedStrafeClipset(cache.ped, 'move_Ped_crouched_strafing')
		}

		RemoveAnimSet('move_ped_crouched')
	},
)

addKeybind({
	name: 'crouch',
	description: 'Crouch',
	defaultKey: 'LCONTROL',
	onReleased: () => {
		if (cache.vehicle) return

		LocalPlayer.state.set('crouch', !LocalPlayer.state.crouch, false)
	},
})
