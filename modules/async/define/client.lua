---@diagnostic disable: duplicate-set-field

function lib.async.define(name, func)
  assert(type(name) == 'string', ("expected 'string' at #1, received '%s'"): format(type(name)))
  assert(type(func) == 'function', ("expected 'function' at #2, received '%s'"): format(type(func)))

  if DefinedAsyncs.client[name] then
    lib.console.fatal(("client async '%s' is already defined"):format(name))
    return false
  end
  DefinedAsyncs.client[name] = true

  RegisterNetEvent(("__tr_async_define:%s"):format(name), function(promiseId, ...)
    local args = { ... }

    local success, response = pcall(function()
      return { func(table.unpack(args)) }
    end)
    if success then
      TriggerServerEvent(("__tr_async_await:%s"):format(name), promiseId, response)
    else
      TriggerServerEvent(("__tr_async_await:%s"):format(name), promiseId, nil)
      lib.console.trace(("client async '%s' threw error: %s"):format(name, response))
    end
  end)
  return true
end