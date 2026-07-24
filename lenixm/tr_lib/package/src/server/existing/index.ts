import { assert, trace } from "../../shared"

export default async (
  entityHandle: number | null, 
  entityNetId?: number | null, 
  timeout = 10000
): Promise<[number, number | null] | [false, null]> => {
  assert(entityHandle || entityNetId, 'entityHandle or entityNetId required')
  
  const start = GetGameTimer()
  
  if (!entityHandle) {
    entityHandle = NetworkGetEntityFromNetworkId(entityNetId!)
    if (!entityHandle) return [false, null]
  }
  
  while (!DoesEntityExist(entityHandle)) {
    if (GetGameTimer() - start >= timeout) {
      trace`timeout: entityHandle ${entityHandle}`
      return [false, null]
    }
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  
  if (!entityNetId) {
    entityNetId = NetworkGetNetworkIdFromEntity(entityHandle)
    if (!entityNetId) entityNetId = null
  }
  
  return [entityHandle, entityNetId]
}