import { getNearest } from "@lenix/lenix/client"
import { requestModel } from "@overextended/ox_lib/client"
import type { Vector4 } from "types/index"
export { emitEvent, onNui, useTimer } from '@lenix/lenix/client'

export const getNearestCoords = getNearest.coords
export const getClosestPlayer = getNearest.player

export const spawnPed = async (coords: Vector4, model = 'a_m_m_prolhost_01') => {
	const requestedModel = await requestModel(model)
	if (!requestedModel) return

	const entity = CreatePed(0, requestedModel, coords[0], coords[1], coords[2] - 1.0, coords[3], false, true)
	TaskStartScenarioInPlace(entity, 'WORLD_HUMAN_CLIPBOARD', 0, true)

	SetModelAsNoLongerNeeded(requestedModel)
	FreezeEntityPosition(entity, true)
	SetEntityInvincible(entity, true)
	SetBlockingOfNonTemporaryEvents(entity, true)
	return entity
}