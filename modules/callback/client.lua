local Callbacks = {}
local CallbackId = 0

function RegisterCallback(name, cb)
    Callbacks[name] = cb
    return true, 'Callback requested successfuly'
end

function TriggerServerCallback(name, ...)
    CallbackId = CallbackId + 1
    local requestId = CallbackId
    
    local promise = promise.new()
    local timedOut = false
    
    Callbacks[requestId] = function(...)
        if not timedOut then
            promise:resolve({success = true, data = {...}})
        end
    end
    
    TriggerServerEvent('callback:triggerServer', name, requestId, ...)
    
    SetTimeout(10000, function()
        if Callbacks[requestId] then
            Callbacks[requestId] = nil
            timedOut = true
            promise:resolve({success = false, error = 'Callback timed out after 10 seconds'})
        end
    end)
    
    local result = Citizen.Await(promise)
    
    if result.success then
        local data = result.data
        
        if #data == 1 and type(data[1]) == 'table' and data[1].error then
            print('^1[Callback Error] Server callback "' .. name .. '" returned an error: ' .. tostring(data[1].error) .. ' (with a reserved keyword)^0')
            return {error = data[1].error}
        end
        
        if #data == 1 then
            return data[1]
        else
            return table.unpack(data)
        end
    else
        print('^3[Callback Warning] Server callback "' .. name .. '" timed out after 10 seconds^0')
        return {error = result.error}
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
        local results = {Callbacks[name](...)}
        TriggerServerEvent('callback:responseServer', requestId, table.unpack(results))
    else
        print('^1[Callback Error] Client callback "' .. name .. '" does not exist^0')
        TriggerServerEvent('callback:responseServer', requestId, {error = 'Callback does not exist'})
    end
end)

exports('RegisterCallback', RegisterCallback)
exports('TriggerServerCallback', TriggerServerCallback)