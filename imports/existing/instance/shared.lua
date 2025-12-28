function lib.awaitInstanceExisting(entity, netId, timeout)
  assert(entity or netId, 'entity or netId required')
  assert(type(entity) == 'number' or not entity, 'entity must be number')
  assert(type(netId) == 'number' or not netId, 'netId must be number')
  assert(type(timeout) == 'number' or not timeout, 'timeout must be number')

  timeout = timeout or 10000
  local start = GetGameTimer()

  if not entity then
    entity = NetworkGetEntityFromNetworkId(netId)
    if not entity or entity == 0 then return false, nil end
  end

  while not DoesEntityExist(entity) do
    if GetGameTimer() - start >= timeout then
      lib.console.trace(('timeout: entity %d'):format(entity))
      return false, nil
    end
    Wait(0)
  end

  if not netId then
    netId = NetworkGetNetworkIdFromEntity(entity)
    if not netId or netId == 0 then netId = nil end
  end

  return entity, netId
end