local Callbacks = {}
local CallbackId = 0

function RegisterCallback(name, cb)
    Callbacks[name] = cb
    return true
end

function TriggerServerCallback(name, ...)
    CallbackId = CallbackId + 1
    local requestId = CallbackId
    
    local promise = promise.new()
    local timedOut = false
    
    Callbacks[requestId] = function(...)
        promise:resolve({success = true, data = {...}})
    end
    
    TriggerServerEvent('callback:triggerServer', name, requestId, ...)
    
    -- Set timeout (10 seconds)
    SetTimeout(10000, function()
        if Callbacks[requestId] then
            Callbacks[requestId] = nil
            timedOut = true
            promise:resolve({success = false})
        end
    end)
    
    local result = Citizen.Await(promise)
    
    if result.success and result.data then
        -- Return the actual value(s) + nil as last value (error indicator)
        local count = #result.data
        result.data[count + 1] = nil
        return table.unpack(result.data, 1, count + 1)
    else
        -- Network failure - return nil + error_message as last value
        print('^3[Callback Warning] Server callback "' .. name .. '" timed out after 10 seconds^0')
        return nil, 'Callback timed out after 10 seconds'
    end
end

RegisterNetEvent('callback:response', function(requestId, ...)
    if Callbacks[requestId] then
        Callbacks[requestId](...)
        Callbacks[requestId] = nil
    end
end)

RegisterNetEvent('callback:triggerClient', function(name, requestId, ...)
    if Callbacks[name] then
        local result = Callbacks[name](...)
        TriggerServerEvent('callback:responseServer', requestId, result)
    else
        print('^1[Callback Error] Client callback "' .. name .. '" does not exist^0')
        TriggerServerEvent('callback:responseServer', requestId, nil)
    end
end)

exports('RegisterCallback', RegisterCallback)
exports('TriggerServerCallback', TriggerServerCallback)