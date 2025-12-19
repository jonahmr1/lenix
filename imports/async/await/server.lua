---@diagnostic disable: duplicate-set-field

local pendingPromises = {}
---@type table<string, boolean>
local definedAddress = {}
local promiseId = 0
local awaitLimit <const> = config.awaitLimit

function lib.async.await(options, name, source, ...)
  if type(options) == 'string' then
    return lib.async.await({ awaitLimit, false }, options, name, source, ...)
  end

  if type(options) == 'number' then
    return lib.async.await({ options, false }, name, source, ...)
  end

  if type(options) == 'boolean' then
    return lib.async.await({ awaitLimit, options }, name, source, ...)
  end
  assert(source, ("expected defined source, received '%s' of '%s'"):format(type(source), source))

  local timeout = options[1] or awaitLimit
  local debug = options[2] or false

  local promise = promise.new()
  promiseId = promiseId + 1
  local currentPromiseId = promiseId
  pendingPromises[currentPromiseId] = promise

  local responseEvent = ("__tr_async_await:%s"):format(name)
  if not definedAddress[responseEvent] then
    definedAddress[responseEvent] = true
    RegisterNetEvent(responseEvent, function(selfpromiseId, response)
      if pendingPromises[selfpromiseId] then
        pendingPromises[selfpromiseId]:resolve({ success = true, returned = response })
        pendingPromises[selfpromiseId] = nil
      end
    end)
  end
  if not DefinedAsyncs.client[name] then
    lib.console.fatal(("async '%s' is not defined"):format(name))
    return
  end

  TriggerClientEvent(("__tr_async_define:%s"):format(name), source, currentPromiseId, ...)

  SetTimeout(timeout, function()
    if pendingPromises[currentPromiseId] then
      pendingPromises[currentPromiseId]:resolve({ success = false })
      pendingPromises[currentPromiseId] = nil
    end
  end)

  local response = Citizen.Await(promise)
  if response.success then
    if debug then
      lib.console.trace(("client async '%s' returned %d values"):format(name, #response.returned))
    end
    return table.unpack(response.returned)
  else
    if debug then
      lib.console.info(("client async '%s' (source: %d) timed out after %dms"):format(name, source, timeout))
    end
  end

  return nil
end
