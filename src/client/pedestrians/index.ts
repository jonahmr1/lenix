import { fatal, info, trace } from '@trippler/tr_lib/client'
import { validateInputs } from './validators'
import { applyScenario, spawnPedEntity } from './wrappers'
import { CreateSinglePed } from '../../shared'
import { awaitInstanceExisting } from '@trippler/tr_lib/shared'

const deletedPeds = new Set()

export const createSinglePed = async (settings: CreateSinglePed, timeout: number) => {
  const hash = settings.hash
  const scenario = settings?.scenario
  let coords = settings.coords
  if (!validateInputs(coords, hash)) return

  const [entityHandle, entityNetId] = await spawnPedEntity(hash, timeout, coords)
  if (!entityHandle) return

  if (scenario) {
    applyScenario(entityHandle, scenario)
  }

  on('onResourceStop', async (resourceName: string) => {
    if (GetCurrentResourceName() == resourceName) {
      trace(`${resourceName} caught stopping, clearing ped (netId: ${entityNetId})`)
      SetEntityAsNoLongerNeeded(entityHandle)
      destroyCreatedPed(entityNetId, timeout)
    }
  })
  return [entityHandle, entityNetId]
}

export const destroyCreatedPed = async (netId: number, timeout: number) => {
  if (typeof netId !== 'number') {
    info(`expected a number at #1, got ${typeof netId}`)
    return false
  }
  if (deletedPeds.has(netId)) {
    trace(`Ped ${netId} already deleted, skipping`)
    return true
  }
  try {
    const [entity, existingNetId] = await awaitInstanceExisting(null, netId, timeout)
    if (!entity || entity === false) {
      info(`Entity ${existingNetId} does not exist`)
      return false
    } else {
      DeleteEntity(entity)
      deletedPeds.add(existingNetId)
      return true
    }
  } catch (error) {
    fatal(`Error in clearCreatedPed`, error)
    return false
  }
}