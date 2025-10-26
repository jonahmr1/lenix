local Callbacks = {}
local CallbackId = 0

function RegisterCallback(name, cb)
    Callbacks[name] = cb
    return true
end

RegisterNetEvent('callback:triggerServer', function(name, requestId, ...)
    local src = source
    local args = {...}
    
    if Callbacks[name] then
        -- Insert source as first argument
        table.insert(args, 1, src)
        local result = Callbacks[name](table.unpack(args))
        TriggerClientEvent('callback:response', src, requestId, result)
    else
        print('^1[Callback Error] Server callback "' .. name .. '" does not exist^0')
        TriggerClientEvent('callback:response', src, requestId, nil)
    end
end)

function TriggerClientCallback(name, source, ...)
    local invokingResource = GetInvokingResource()
    CallbackId = CallbackId + 1
    local requestId = CallbackId
    
    local promise = promise.new()
    local timedOut = false
    
    Callbacks[requestId] = function(...)
        promise:resolve({success = true, data = {...}})
    end
    
    TriggerClientEvent('callback:triggerClient', source, name, requestId, ...)
    
    -- Set timeout
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
        print('^3[Callback Warning] Client callback "' .. name .. '" for player ' .. source .. ' timed out after 10 seconds^0')
        return nil, 'Callback timed out after 10 seconds'
    end
end

RegisterNetEvent('callback:responseServer', function(requestId, ...)
    if Callbacks[requestId] then
        Callbacks[requestId](...)
        Callbacks[requestId] = nil
    end
end)

exports('RegisterCallback', RegisterCallback)
exports('TriggerClientCallback', TriggerClientCallback)