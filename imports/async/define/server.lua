---@diagnostic disable: duplicate-set-field

function lib.async.define(endpoint, Function)
  assert(type(endpoint) == 'string', ("expected 'string' at #1, received '%s'"): format(type(endpoint)))
  assert(type(Function) == 'function', ("expected 'function' at #2, received '%s'"): format(type(Function)))

  if DefinedAsyncs.server[endpoint] then
    lib.console.fatal(("server async '%s' is already defined"):format(endpoint))
    return false
  end

  DefinedAsyncs.server[endpoint] = true

  RegisterNetEvent(("__tr_async_define:%s"):format(endpoint), function(promiseId, ...)
    local source <const> = source
    local args = { ... }

    local success, response = pcall(function()
      return { Function(source, table.unpack(args)) }
    end)
    if success then
      TriggerClientEvent(("__tr_async_await:%s"):format(endpoint), source, promiseId, response)
    else
      TriggerClientEvent(("__tr_async_await:%s"):format(endpoint), source, promiseId, nil)
      lib.console.trace(("server async '%s' (client %d) threw error: %s"):format(endpoint, source, response))
    end
  end)
  return true
end