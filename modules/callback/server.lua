local Callbacks = {}
local CallbackId = 0
local callbackTimeout<const> = lib.load('config', GetCurrentResourceName()).callbackTimeout
lib.callback = {}

function lib.callback.register(name, cb)
    if type(cb) == 'function' then
        Callbacks[name] = cb
        return true, 'Callback registered successfully'
    end
    
    if type(cb) == 'table' then
        Callbacks[name] = function(...)
            return cb(...)
        end
        return true, 'JS Callback registered successfully'
    end
    
    lib.print.err(string.format("Attempted to register callback '%s' with non-function value (type: %s)", name, type(cb)))
    return false
end

function lib.callback.await(debug, name, timeout, source, ...)
    if type(debug) ~= 'boolean' then
        return lib.callback.await(false, debug, name, timeout, source, ...)
    end

    if type(timeout) ~= 'number' then
        return lib.callback.await(debug, name, callbackTimeout, source, ...)
    end
    assert(type(name) == 'string', ('Callback name must be a string, received %s as %s'):format(name, type(name)))
    assert(source, 'Caught invalid source')

    CallbackId = CallbackId + 1
    local requestId = CallbackId

    local promise = promise.new()
    local timedOut = false

    if debug then
        lib.print.debug(("Triggering client callback '%s' for player %d (ID: %d, Timeout: %dms)"):format(name, source,
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
                lib.print.debug(("Client callback '%s' for player %d timed out after %dms"):format(name, source, timeout))
            end
            promise:resolve({ success = false, reason = 'timeout' })
        end
    end)

    local result = Citizen.Await(promise)

    if result.success then
        local data = result.data

        if #data == 0 then
            if debug then
                lib.print.debug(("Client callback '%s' returned nothing (nil)"):format(name))
            end
            return nil
        end

        if #data == 1 then
            if debug then
                local value = data[1]
                if value == nil then
                    lib.print.debug(("Client callback '%s' returned explicit nil"):format(name))
                else
                    lib.print.debug(("Client callback '%s' returned single value (type: %s)"):format(name, type(value)))
                end
            end
            return data[1]
        end

        if debug then
            lib.print.debug(("Client callback '%s' returned %d values"):format(name, #data))
        end
        return table.unpack(data)
    else
        if not debug then
            lib.print.debug(("Client callback '%s' for player %d timed out after %dms"):format(name, source, timeout))
        end
        return nil
    end
end

RegisterNetEvent('__tr_cb:triggerServer', function(name, requestId, ...)
    local src = source
    local args = { ... }
    
    if Callbacks[name] then
        local success, results = pcall(function()
            return { Callbacks[name](src, table.unpack(args)) }
        end)

        if success then
            TriggerClientEvent('__tr_cb:responseClient', src, requestId, table.unpack(results))
        else
            lib.print.debug(("Server callback '%s' threw error: %s"):format(name, results))
            TriggerClientEvent('__tr_cb:responseClient', src, requestId, nil)
        end
    else
        lib.print.debug(("Server callback %s does not exist"):format(name))
        TriggerClientEvent('__tr_cb:responseClient', src, requestId, nil)
    end
end)

RegisterNetEvent('__tr_cb:responseServer', function(requestId, ...)
    if Callbacks[requestId] then
        Callbacks[requestId](...)
        Callbacks[requestId] = nil
    end
end)