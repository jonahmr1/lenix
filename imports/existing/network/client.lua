---@see this need to be refactored

function lib.awaitNetworkExisting(netId, entity, timeout)
  assert(type(netId) == 'number' or netId == nil, ('netId must be a number, got %s'):format(type(netId)))
  assert(type(entity) == 'number' or entity == nil, ('entity must be a number, got %s'):format(type(entity)))
  assert(timeout == nil or type(timeout) == 'number', ('timeout must be a number, got %s'):format(type(timeout)))
  assert(entity ~= nil or netId ~= nil, 'entity or netId must be valid values')

  timeout = timeout or 10000
  local startTime = GetGameTimer()

  if not netId then
    local entity, existingNetId = lib.awaitInstanceExisting(entity, nil, timeout)
    if not existingNetId or existingNetId == 0 then
      return false, nil
    end
    netId = existingNetId
  end

  while not NetworkDoesEntityExistWithNetworkId(netId) do
    if GetGameTimer() - startTime >= timeout then
      lib.console.trace(('awaitNetworkedExisting timeout reached, netId: %d'):format(netId))
      return false, nil
    end
    Wait(0)
  end

  entity = NetworkGetEntityFromNetworkId(netId)
  if not entity or entity == 0 then
    return netId, false
  end

  return netId, entity
end