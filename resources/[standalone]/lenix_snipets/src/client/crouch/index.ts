import { cache, sleep } from '@overextended/ox_lib'

let isCrouching = false
let walkSet = 'default'

const loadAnimSet = async (anim: string) => {
	if (HasAnimSetLoaded(anim)) return

	RequestAnimSet(anim)

	while (!HasAnimSetLoaded(anim))
		await sleep(10)
}

const resetAnimSet = async () => {
	ResetPedMovementClipset(cache.ped, 1.0)
	ResetPedWeaponMovementClipset(cache.ped)
	ResetPedStrafeClipset(cache.ped)

	if (walkSet !== 'default') {
		await loadAnimSet(walkSet)
		SetPedMovementClipset(cache.ped, walkSet, 1.0)
		RemoveAnimSet(walkSet)
	}
}

RegisterCommand(
	'togglecrouch',
	async () => {
		if (
			IsPedSittingInAnyVehicle(cache.ped) ||
			IsPedFalling(cache.ped) ||
			IsPedSwimming(cache.ped) ||
			IsPedSwimmingUnderWater(cache.ped) ||
			IsPauseMenuActive()
		) {
			return
		}

		ClearPedTasks(cache.ped)

		if (isCrouching) {
			await resetAnimSet()
			SetPedStealthMovement(cache.ped, false, 'DEFAULT_ACTION')
			isCrouching = false
			return
		}

		await loadAnimSet('move_ped_crouched')

		SetPedMovementClipset(cache.ped, 'move_ped_crouched', 1.0)
		SetPedStrafeClipset(cache.ped, 'move_ped_crouched_strafing')

		isCrouching = true
	},
	false
)

RegisterKeyMapping(
	'togglecrouch',
	'Toggle Crouch',
	'keyboard',
	'LCONTROL'
)