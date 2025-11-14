function lib.awaitInstanceExisting(entity, netId, timeout)
  assert(type(entity) == 'number' or entity == nil, ('entity must be a number, got %s'):format(type(entity)))
  assert(type(netId) == 'number' or netId == nil, ('netId must be a number, got %s'):format(type(netId)))
  assert(timeout == nil or type(timeout) == 'number', ('timeout must be a number, got %s'):format(type(timeout)))

  timeout = timeout or 10000
  local startTime = GetGameTimer()

  if not entity then
    entity = NetworkGetEntityFromNetworkId(netId)
  end

  while not DoesEntityExist(entity) do
    if GetGameTimer() - startTime >= timeout then
      lib.console.trace(('awaitExisting timeout reached, entity: %d'):format(entity))
      return false
    end
    Wait(0)
  end

  if not netId then
    netId = NetworkGetNetworkIdFromEntity(entity)
    if not netId then
      return false
    end
  end

  return entity, netId
end