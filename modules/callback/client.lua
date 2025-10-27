local Callbacks = {}
local CallbackId = 0

local function register(name, cb)
    Callbacks[name] = cb
    return true, 'Callback requested successfully'
end

local function await(debug, name, timeout, ...)
    -- Handle backward compatibility
    if type(debug) ~= 'boolean' then
        return await(false, debug, name, timeout, ...)
    end
    
    if type(timeout) ~= 'number' then
        return await(debug, name, 10000, timeout, ...)
    end
    
    CallbackId = CallbackId + 1
    local requestId = CallbackId
    
    local promise = promise.new()
    local timedOut = false

    if debug then
        lib.print.debug(("Triggering server callback '%s' (ID: %d, Timeout: %dms)"):format(name, requestId, timeout))
    end
    
    Callbacks[requestId] = function(...)
        if not timedOut then
            promise:resolve({success = true, data = {...}})
        end
    end
    
    TriggerServerEvent('callback:triggerServer', name, requestId, ...)
    
    SetTimeout(timeout, function()
        if Callbacks[requestId] then
            Callbacks[requestId] = nil
            timedOut = true
            if debug then
                lib.print.debug(("Server callback '%s' timed out after %dms"):format(name, timeout))
            end
            promise:resolve({success = false, reason = 'timeout'})
        end
    end)
    
    local result = Citizen.Await(promise)
    
    if result.success then
        local data = result.data
        
        if #data == 0 then
            if debug then
                lib.print.debug(("Server callback '%s' returned nothing (nil)"):format(name))
            end
            return nil
        end
        
        if #data == 1 then
            if debug then
                local value = data[1]
                if value == nil then
                    lib.print.debug(("Server callback '%s' returned explicit nil"):format(name))
                else
                    lib.print.debug(("Server callback '%s' returned single value (type: %s)"):format(name, type(value)))
                end
            end
            return data[1]
        end
        
        if debug then
            lib.print.debug(("Server callback '%s' returned %d values"):format(name, #data))
        end
        return table.unpack(data)
    else
        if not debug then
            lib.print.debug(("Server callback '%s' timed out after %dms"):format(name, timeout))
        end
        return nil
    end
end

RegisterNetEvent('callback:responseClient', function(requestId, ...)
    if Callbacks[requestId] then
        Callbacks[requestId](...)
        Callbacks[requestId] = nil
    end
end)

RegisterNetEvent('callback:triggerClient', function(name, requestId, ...)
    if Callbacks[name] then
        local results = {Callbacks[name](...)}
        TriggerServerEvent('callback:responseServer', requestId, table.unpack(results))
    else
        lib.print.debug(("Client callback %s does not exist"):format(name))
        TriggerServerEvent('callback:responseServer', requestId, nil)
    end
end)

local modules = {
    register = register,
    await = await
}

exports('callback', function()
    return modules
end)