---@diagnostic disable: duplicate-set-field

function lib.async.define(name, func)
  assert(type(name) == 'string', ("expected 'string' at #1, received '%s'"): format(type(name)))
  assert(type(func) == 'function', ("expected 'function' at #2, received '%s'"): format(type(func)))

  if DefinedAsyncs.server[name] then
    lib.console.fatal(("server async '%s' is already defined"):format(name))
    return false
  end

  DefinedAsyncs.server[name] = true

  RegisterNetEvent(("__tr_async_define:%s"):format(name), function(promiseId, ...)
    local source <const> = source
    local args = { ... }

    local success, response = pcall(function()
      return { func(source, table.unpack(args)) }
    end)
    if success then
      TriggerClientEvent(("__tr_async_await:%s"):format(name), source, promiseId, response)
    else
      TriggerClientEvent(("__tr_async_await:%s"):format(name), source, promiseId, nil)
      lib.console.trace(("server async '%s' (client %d) threw error: %s"):format(name, source, response))
    end
  end)
  return true
end