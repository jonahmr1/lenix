---@diagnostic disable: duplicate-set-field

local pendingPromises = {}
---@type table<string, boolean>
local definedAddress = {}
local promiseId = 0
local awaitLimit <const> = config.awaitLimit


function lib.async.await(options, name, ...)
  if type(options) == 'string' then
    return lib.async.await({ awaitLimit, false }, options, name, ...)
  end

  if type(options) == 'number' then
    return lib.async.await({ options, false }, name, ...)
  end

  if type(options) == 'boolean' then
    return lib.async.await({ awaitLimit, options }, name, ...)
  end

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

  if not DefinedAsyncs.server[name] then
    lib.console.fatal(("async '%s' is not defined"):format(name))
    return
  end
  TriggerServerEvent(("__tr_async_define:%s"):format(name), currentPromiseId, ...)

  SetTimeout(timeout, function()
    if pendingPromises[currentPromiseId] then
      pendingPromises[currentPromiseId]:resolve({ success = false })
      pendingPromises[currentPromiseId] = nil
    end
  end)

  local response = Citizen.Await(promise)
  if response.success then
    if debug then
      lib.console.trace(("server async '%s' returned %d values"):format(name, #response.returned))
    end
    return table.unpack(response.returned)
  else
    if debug then
      lib.console.info(("server async '%s' timed out after %dms"):format(name, timeout))
    end
  end

  return nil
end
