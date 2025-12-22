import { requestModel } from '@trippler/tr_lib/client'
import { awaitInstanceExisting } from '@trippler/tr_lib/shared'
import { CreateSinglePed } from '../../shared'

export const spawnPedEntity = async (hash: number, timeout: number, coords: number[]) => {
  const response = await requestModel(hash, timeout)
  if (!response) return

  const entityHandle = CreatePed(0, hash, coords[0], coords[1], coords[2], coords[3], true, true)
  const [entity, netId] = await awaitInstanceExisting(entityHandle, null, timeout)
  if (!netId || !entity) return
  return [entity, netId]
}

export const applyScenario = (entityHandle: number, scenario: CreateSinglePed['scenario']) => {
  scenario?.name && TaskStartScenarioInPlace(entityHandle, scenario.name, scenario?.timeToLeave, scenario?.playIntroClip)
  scenario?.freeze && FreezeEntityPosition(entityHandle, true)
  scenario?.oblivious && SetBlockingOfNonTemporaryEvents(entityHandle, true)
}
