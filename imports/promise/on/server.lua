---@diagnostic disable: duplicate-set-field

function lib.promise.on(endpoint, Function)
  assert(type(endpoint) == 'string', ("expected 'string' at #1, received '%s'"): format(type(endpoint)))
  assert(type(Function) == 'function', ("expected 'function' at #2, received '%s'"): format(type(Function)))

  if DefinedAsyncs.server[endpoint] then
    lib.console.fatal(("server promise '%s' is already defined"):format(endpoint))
    return false
  end

  DefinedAsyncs.server[endpoint] = true
  TriggerEvent('__tr_promise_on_self_server_lua_backward_compatibility', endpoint)

  RegisterNetEvent(("__tr_promise_on:%s"):format(endpoint), function(promiseId, ...)
    local source<const> = source
    local args<const> = { ... }

    local success<const>, response<const> = pcall(function()
      return { Function(source, table.unpack(args)) }
    end)
    if success then
      TriggerClientEvent(("__tr_promise_trigger:%s"):format(endpoint), source, promiseId, response)
    else
      TriggerClientEvent(("__tr_promise_trigger:%s"):format(endpoint), source, promiseId, nil)
      lib.console.trace(("server promise '%s' (client %d) threw error: %s"):format(endpoint, source, response))
    end
  end)
  return true
end