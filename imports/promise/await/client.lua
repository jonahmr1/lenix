---@diagnostic disable: duplicate-set-field

local pendingPromises = {}
---@type table<string, boolean>
local definedAddress = {}
local promiseId = 0
local awaitLimit <const> = config.awaitLimit


function lib.promise.await(options, endpoint, ...)
  if type(options) == 'string' then
    return lib.promise.await({ awaitLimit, false }, options, endpoint, ...)
  end

  if type(options) == 'number' then
    return lib.promise.await({ options, false }, endpoint, ...)
  end

  if type(options) == 'boolean' then
    return lib.promise.await({ awaitLimit, options }, endpoint, ...)
  end

  local timeout = options[1] or awaitLimit
  local debug = options[2] or false

  local promise = promise.new()
  promiseId = promiseId + 1
  local currentPromiseId = promiseId
  pendingPromises[currentPromiseId] = promise

  local responseEvent = ("__tr_promise_trigger:%s"):format(endpoint)
  if not definedAddress[responseEvent] then
    definedAddress[responseEvent] = true
    RegisterNetEvent(responseEvent, function(selfpromiseId, response)
      if pendingPromises[selfpromiseId] then
        pendingPromises[selfpromiseId]:resolve({ success = true, returned = response })
        pendingPromises[selfpromiseId] = nil
      end
    end)
  end

  if not DefinedAsyncs.server[endpoint] then
    lib.console.fatal(("promise '%s' is not defined"):format(endpoint))
    return
  end
  TriggerServerEvent(("__tr_promise_on:%s"):format(endpoint), currentPromiseId, ...)

  SetTimeout(timeout, function()
    if pendingPromises[currentPromiseId] then
      pendingPromises[currentPromiseId]:resolve({ success = false })
      pendingPromises[currentPromiseId] = nil
    end
  end)

  local response = Citizen.Await(promise)
  if response.success then
    if debug then
      lib.console.trace(("server promise '%s' returned %d values"):format(endpoint, #response.returned))
    end
    return table.unpack(response.returned)
  else
    if debug then
      lib.console.info(("server promise '%s' timed out after %dms"):format(endpoint, timeout))
    end
  end

  return nil
end
