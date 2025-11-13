function lib.awaitInstanceExisting(entity, timeout)
  assert(type(entity) == 'number', ('entity must be a number, got %s'):format(type(entity)))
  assert(timeout == nil or type(timeout) == 'number', ('timeout must be a number, got %s'):format(type(timeout)))

  timeout = timeout or 10000
  while not DoesEntityExist(entity) do
    timeout -= 1
    if timeout <= 0 then
      lib.console.trace('awaitExisting timeout reached')
      return false
    end
    Wait(0)
  end

  local netId<const> = NetworkGetNetworkIdFromEntity(entity)
  if not netId then
    return false
  end

  return netId
end