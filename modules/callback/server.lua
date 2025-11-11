local Callbacks = {}
local CallbackId = 0
local callbackTimeout<const> = lib.load('config', GetCurrentResourceName()).callbackTimeout
lib.callback = {}

function lib.callback.register(name, cb)
    if type(cb) == 'function' then
        Callbacks[name] = cb
        return true
    end
    
    if type(cb) == 'table' then
        Callbacks[name] = function(...)
            return cb(...)
        end
        return true
    end
    
    lib.console.fatal(("Attempted to register callback '%s' with non-function value (type: %s)"):format(name, type(cb)))
    return false
end

function lib.callback.await(debug, name, timeout, source, ...)
    if type(debug) ~= 'boolean' then
        return lib.callback.await(false, debug, name, timeout, source, ...)
    end
    assert(source, 'Caught invalid source')

    CallbackId = CallbackId + 1
    local requestId = CallbackId

    local promise = promise.new()
    local timedOut = false

    if debug then
        lib.console.trace(("Triggering client callback '%s' for player %d (ID: %d, Timeout: %dms)"):format(name, source,
            requestId, timeout))
    end

    Callbacks[requestId] = function(...)
        if not timedOut then
            promise:resolve({ success = true, data = { ... } })
        end
    end

    TriggerClientEvent('__tr_cb:triggerClient', source, name, requestId, ...)

    SetTimeout(timeout, function()
        if Callbacks[requestId] then
            Callbacks[requestId] = nil
            timedOut = true
            if debug then
                lib.console.trace(("Client callback '%s' for player %d timed out after %dms"):format(name, source, timeout))
            end
            promise:resolve({ success = false, reason = 'timeout' })
        end
    end)

    local result = Citizen.Await(promise)

    if result.success then
        local data = result.data

        if #data == 0 then
            if debug then
                lib.console.trace(("Client callback '%s' returned nothing (nil)"):format(name))
            end
            return nil
        end

        if #data == 1 then
            if debug then
                local value = data[1]
                if value == nil then
                    lib.console.trace(("Client callback '%s' returned explicit nil"):format(name))
                else
                    lib.console.trace(("Client callback '%s' returned single value (type: %s)"):format(name, type(value)))
                end
            end
            return data[1]
        end

        if debug then
            lib.console.trace(("Client callback '%s' returned %d values"):format(name, #data))
        end
        return table.unpack(data)
    else
        if debug then
            lib.console.trace(("Client callback '%s' for player %d timed out after %dms"):format(name, source, timeout))
        end
        return nil
    end
end

RegisterNetEvent('__tr_cb:triggerServer', function(debug, name, requestId, ...)
    local src = source
    local args = { ... }
    
    if Callbacks[name] then
        local success, results = pcall(function()
            return { Callbacks[name](src, table.unpack(args)) }
        end)

        if success then
            TriggerClientEvent('__tr_cb:responseClient', src, requestId, table.unpack(results))
        else
            TriggerClientEvent('__tr_cb:responseClient', src, requestId, nil)
            lib.console.trace(("Server callback '%s' threw fatalor: %s"):format(name, results))
        end
    else
        TriggerClientEvent('__tr_cb:responseClient', src, requestId, nil)
        lib.console.fatal(("Server callback '%s' does not exist"):format(name))
    end
end)

RegisterNetEvent('__tr_cb:responseServer', function(requestId, ...)
    if Callbacks[requestId] then
        Callbacks[requestId](...)
        Callbacks[requestId] = nil
    end
end)