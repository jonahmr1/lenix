local callbacks = {}
local awaitingCallbacks = {}
local callbackId = 0

local function generateId()
    callbackId = callbackId + 1
    return callbackId
end

lib = lib or {}
lib.callback = {}

function lib.callback.register(name, fn)
    if type(name) ~= 'string' then
        error('Callback name must be a string')
    end
    
    if type(fn) ~= 'function' then
        error('Callback handler must be a function')
    end
    
    callbacks[name] = fn
end

function lib.callback.awaitServer(name, timeout, ...)
    if type(name) ~= 'string' then
        error('Callback name must be a string')
    end
    
    timeout = timeout or 5000
    
    local cbId = generateId()
    local promise = promise.new()
    
    awaitingCallbacks[cbId] = promise
    
    TriggerServerEvent('__callback:trigger', cbId, name, {...})
    
    if timeout and timeout > 0 then
        local timeoutThread = SetTimeout(timeout, function()
            if awaitingCallbacks[cbId] then
                awaitingCallbacks[cbId]:resolve(nil)
                awaitingCallbacks[cbId] = nil
            end
        end)
        
        local result = Citizen.Await(promise)
        
        if awaitingCallbacks[cbId] == nil then
            ClearTimeout(timeoutThread)
        end
        
        return table.unpack(result or {})
    else
        local result = Citizen.Await(promise)
        return table.unpack(result or {})
    end
end

function lib.callback.awaitClient(name, playerId, timeout, ...)
    if type(name) ~= 'string' then
        error('Callback name must be a string')
    end
    
    if type(playerId) ~= 'number' then
        error('Player ID must be a number')
    end
    
    timeout = timeout or 5000
    
    local cbId = generateId()
    local promise = promise.new()
    
    awaitingCallbacks[cbId] = promise
    
    TriggerClientEvent('__callback:response', playerId, cbId, name, {...})
    
    if timeout and timeout > 0 then
        local timeoutThread = SetTimeout(timeout, function()
            if awaitingCallbacks[cbId] then
                awaitingCallbacks[cbId]:resolve(nil)
                awaitingCallbacks[cbId] = nil
            end
        end)
        
        local result = Citizen.Await(promise)
        
        if awaitingCallbacks[cbId] == nil then
            ClearTimeout(timeoutThread)
        end
        
        return table.unpack(result or {})
    else
        local result = Citizen.Await(promise)
        return table.unpack(result or {})
    end
end

if IsDuplicityVersion() then
    RegisterNetEvent('__callback:trigger', function(cbId, name, args)
        local src = source
        
        if not callbacks[name] then
            TriggerClientEvent('__callback:result', src, cbId, {nil})
            return
        end
        
        local success, result = pcall(callbacks[name], src, table.unpack(args or {}))
        
        if not success then
            TriggerClientEvent('__callback:result', src, cbId, {nil})
            return
        end
        
        local packed = {result}
        TriggerClientEvent('__callback:result', src, cbId, packed)
    end)
    
    RegisterNetEvent('__callback:response', function(cbId, name, args)
        local src = source
        
        if not callbacks[name] then
            TriggerClientEvent('__callback:clientResult', src, cbId, {nil})
            return
        end
        
        local success, result = pcall(callbacks[name], table.unpack(args or {}))
        
        if not success then
            TriggerClientEvent('__callback:clientResult', src, cbId, {nil})
            return
        end
        
        TriggerClientEvent('__callback:clientResult', src, cbId, {result})
    end)
    
    RegisterNetEvent('__callback:clientResult', function(cbId, result)
        if awaitingCallbacks[cbId] then
            awaitingCallbacks[cbId]:resolve(result)
            awaitingCallbacks[cbId] = nil
        end
    end)
else
    RegisterNetEvent('__callback:result', function(cbId, result)
        if awaitingCallbacks[cbId] then
            awaitingCallbacks[cbId]:resolve(result)
            awaitingCallbacks[cbId] = nil
        end
    end)
    
    RegisterNetEvent('__callback:response', function(cbId, name, args)
        if not callbacks[name] then
            TriggerServerEvent('__callback:clientResult', cbId, {nil})
            return
        end
        
        local success, result = pcall(callbacks[name], table.unpack(args or {}))
        
        if not success then
            TriggerServerEvent('__callback:clientResult', cbId, {nil})
            return
        end
        
        TriggerServerEvent('__callback:clientResult', cbId, {result})
    end)
end

if IsDuplicityVersion() then
    exports('callback', function()
        return lib.callback
    end)
else
    exports('callback', function()
        return lib.callback
    end)
end