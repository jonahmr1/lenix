---@see this need to be refactored

function lib.awaitNetworkExisting(entityNetId, entityHandle, timeout)
  assert(entityHandle or entityNetId, 'entity or netId are required')
  assert(type(entityNetId) == 'number' or entityNetId == nil, ('netId must be a number, got %s'):format(type(entityNetId)))
  assert(type(entityHandle) == 'number' or entityHandle == nil, ('entity must be a number, got %s'):format(type(entityHandle)))
  assert(timeout == nil or type(timeout) == 'number', ('timeout must be a number, got %s'):format(type(timeout)))

  timeout = timeout or 10000
  local startTime = GetGameTimer()

  if not entityNetId then
    local _, existingNetId = lib.awaitInstanceExisting(entityHandle, nil, timeout)
    if not existingNetId or existingNetId == 0 then
      return false, nil
    end
    entityNetId = existingNetId
  end

  while not NetworkDoesEntityExistWithNetworkId(entityNetId) do
    if GetGameTimer() - startTime >= timeout then
      lib.console.trace(('awaitNetworkedExisting timeout reached, netId: %d'):format(entityNetId))
      return false, nil
    end
    Wait(0)
  end

  entityHandle = NetworkGetEntityFromNetworkId(entityNetId)
  if not entityHandle or entityHandle == 0 then
    return entityNetId, false
  end

  return entityNetId, entityHandle
end