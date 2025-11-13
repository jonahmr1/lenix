function lib.awaitNetworkExisting(netId, timeout)
  assert(type(netId) == 'number', ('entity must be a number, got %s'):format(type(netId)))
  assert(timeout == nil or type(timeout) == 'number', ('timeout must be a number, got %s'):format(type(timeout)))

  timeout = timeout or 10000
  while not NetworkDoesEntityExistWithNetworkId(netId) do
    timeout -= 1
    if timeout <= 0 then
      lib.console.trace('awaitNetworkedExisting timeout reached')
      return false
    end
    Wait(0)
  end

  local entity<const> = NetworkGetEntityFromNetworkId(netId)
  lib.awaitInstanceExisting(entity, timeout)

  if not entity then
    return false
  end

  return entity
end