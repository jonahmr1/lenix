function lib.requestModel(hash, timeout)
  assert(type(hash) == 'number', ('hash must be a number, got %s'):format(type(hash)))
  assert(timeout == nil or type(timeout) == 'number', ('timeout must be a number, got %s'):format(type(timeout)))

  RequestModel(hash)
  timeout = timeout or 10000
  while not HasModelLoaded(hash) do
    timeout -= 1
    if timeout <= 0 then
      return false
    end
    Wait(0)
  end
  return true
end