---@diagnostic disable: duplicate-set-field

function lib.async.define(endpoint, Function)
  assert(type(endpoint) == 'string', ("expected 'string' at #1, received '%s'"): format(type(endpoint)))
  assert(type(Function) == 'function', ("expected 'function' at #2, received '%s'"): format(type(Function)))

  if DefinedAsyncs.client[endpoint] then
    lib.console.fatal(("client async '%s' is already defined"):format(endpoint))
    return false
  end
  DefinedAsyncs.client[endpoint] = true

  RegisterNetEvent(("__tr_async_define:%s"):format(endpoint), function(promiseId, ...)
    local args = { ... }

    local success, response = pcall(function()
      return { Function(table.unpack(args)) }
    end)
    if success then
      TriggerServerEvent(("__tr_async_await:%s"):format(endpoint), promiseId, response)
    else
      TriggerServerEvent(("__tr_async_await:%s"):format(endpoint), promiseId, nil)
      lib.console.trace(("client async '%s' threw error: %s"):format(endpoint, response))
    end
  end)
  return true
end