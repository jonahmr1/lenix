function lib.awaitInstanceExisting(entityHandle, entityNetId, timeout)
  assert(entityHandle or entityNetId, 'entity or netId required')
  assert(type(entityHandle) == 'number' or not entityHandle, 'entity must be number')
  assert(type(entityNetId) == 'number' or not entityNetId, 'netId must be number')
  assert(type(timeout) == 'number' or not timeout, 'timeout must be number')

  timeout = timeout or 10000
  local start = GetGameTimer()

  if not entityHandle then
    entityHandle = NetworkGetEntityFromNetworkId(entityNetId)
    if not entityHandle or entityHandle == 0 then return false, nil end
  end

  while not DoesEntityExist(entityHandle) do
    if GetGameTimer() - start >= timeout then
      lib.console.trace(('timeout: entity %d'):format(entityHandle))
      return false, nil
    end
    Wait(0)
  end

  if not entityNetId then
    entityNetId = NetworkGetNetworkIdFromEntity(entityHandle)
    if not entityNetId or entityNetId == 0 then entityNetId = nil end
  end

  return entityHandle, entityNetId
end