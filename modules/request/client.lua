function lib.requestModel(model, timeout)
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