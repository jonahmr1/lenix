function lib.requestModel(model, timeout)
  assert(type(model) == 'string', ('model must be a string of hash, got %s'):format(type(model)))
  assert(timeout == nil or type(timeout) == 'number', ('timeout must be a number, got %s'):format(type(timeout)))

  RequestModel(model)
  timeout = timeout or 10000
  while not HasModelLoaded(model) do
    timeout -= 1
    if timeout <= 0 then
      return false
    end
    Wait(0)
  end
  return true
end