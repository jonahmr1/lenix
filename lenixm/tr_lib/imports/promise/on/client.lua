---@diagnostic disable: duplicate-set-field

function lib.promise.on(endpoint, Function)
  assert(type(endpoint) == 'string', ("expected 'string' at #1, received '%s'"): format(type(endpoint)))
  assert(type(Function) == 'function', ("expected 'function' at #2, received '%s'"): format(type(Function)))

  if DefinedAsyncs.client[endpoint] then
    lib.console.fatal(("client promise '%s' is already defined"):format(endpoint))
    return false
  end
  DefinedAsyncs.client[endpoint] = true

  TriggerEvent('__tr_promise_on_self_client_lua_backward_compatibility', endpoint)

  RegisterNetEvent(("__tr_promise_on:%s"):format(endpoint), function(promiseId, ...)
    local args = { ... }

    local success, response = pcall(function()
      return { Function(table.unpack(args)) }
    end)
    if success then
      TriggerServerEvent(("__tr_promise_trigger:%s"):format(endpoint), promiseId, response)
    else
      TriggerServerEvent(("__tr_promise_trigger:%s"):format(endpoint), promiseId, nil)
      lib.console.trace(("client promise '%s' threw error: %s"):format(endpoint, response))
    end
  end)
  return true
end