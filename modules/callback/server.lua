local Callbacks = {}
local CallbackId = 0
local callbackTimeout = lib.load('config') or 10000 -- Default 10 seconds if config fails

function lib.callback.register(name, cb)
    Callbacks[name] = cb
    return true, 'Callback requested successfully'
end

function lib.callback.await(debug, name, source, timeout, ...)
    if type(debug) ~= 'boolean' then
        return lib.callback.await(false, debug, name, source, timeout, ...)
    end

    if type(timeout) ~= 'number' then
        return lib.callback.await(debug, name, source, 10000, ...)
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

    TriggerClientEvent('callback:triggerClient', source, name, requestId, ...)

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

RegisterNetEvent('callback:triggerServer', function(name, requestId, ...)
    local src = source
    local args = { ... }
    -- the server is faster than the client :), we don't need that thing that is in your head pal
    if Callbacks[name] then
        table.insert(args, 1, src)

        local success, results = pcall(function()
            return { Callbacks[name](table.unpack(args)) }
        end)

        if success then
            TriggerClientEvent('callback:responseClient', src, requestId, table.unpack(results))
        else
            lib.print.debug(("Server callback '%s' threw error: %s"):format(name, results))
            TriggerClientEvent('callback:responseClient', src, requestId, nil)
        end
    else
        lib.print.debug(("Server callback %s does not exist"):format(name))
        TriggerClientEvent('callback:responseClient', src, requestId, nil)
    end
end)

RegisterNetEvent('callback:responseServer', function(requestId, ...)
    if Callbacks[requestId] then
        Callbacks[requestId](...)
        Callbacks[requestId] = nil
    end
end)