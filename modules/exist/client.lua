function lib.awaitNetworkExisting(netId, timeout)
  assert(type(netId) == 'number', ('entity must be a number, got %s'):format(type(netId)))
  assert(timeout == nil or type(timeout) == 'number', ('timeout must be a number, got %s'):format(type(timeout)))

  timeout = timeout or 10000
  local startTime = GetGameTimer()

  while not NetworkDoesEntityExistWithNetworkId(netId) do
    if GetGameTimer() - startTime >= timeout then
      lib.console.trace(('awaitNetworkedExisting timeout reached, netId: %d'):format(netId))
      return false
    end
    Wait(0)
  end

  local entity<const> = NetworkGetEntityFromNetworkId(netId)
  lib.awaitInstanceExisting(entity, netId, timeout)

  if not entity then
    return false
  end

  return entity
end