local callbacks = {}
local awaitingCallbacks = {}
local callbackId = 0

local function generateId()
    callbackId = callbackId + 1
    return callbackId
end

lib = lib or {}
lib.callback = {}

local function register(name, fn)
    if type(name) ~= 'string' then
        error('Callback name must be a string')
    end
    
    if type(fn) ~= 'function' and type(fn) ~= 'table' then
        error('Callback handler must be a function')
    end
    
    callbacks[name] = fn
end

local function awaitServer(name, timeout, ...)
    if type(name) ~= 'string' then
        error('Callback name must be a string')
    end
    
    timeout = timeout or 5000
    
    local cbId = generateId()
    local promise = promise.new()
    
    awaitingCallbacks[cbId] = promise
    
    if IsDuplicityVersion() then
        TriggerEvent('__callback:s2s_trigger', cbId, name, {...})
    else
        TriggerServerEvent('__callback:trigger', cbId, name, {...})
    end
    
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

local function awaitClient(name, playerId, timeout, ...)
    if type(name) ~= 'string' then
        error('Callback name must be a string')
    end
    
    if type(playerId) ~= 'number' then
        error('Player ID must be a number')
    end
    
    timeout = type(timeout) == 'number' and timeout or 5000
    
    local cbId = generateId()
    local promise = promise.new()
    
    awaitingCallbacks[cbId] = promise
    
    if IsDuplicityVersion() then
        TriggerClientEvent('__callback:response', playerId, cbId, name, {...})
    else
        TriggerServerEvent('__callback:c2c_relay', cbId, playerId, name, {...})
    end
    
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

lib.callback.register = register
lib.callback.awaitServer = awaitServer
lib.callback.awaitClient = awaitClient

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
    
    AddEventHandler('__callback:s2s_trigger', function(cbId, name, args)
        if not callbacks[name] then
            TriggerEvent('__callback:s2s_result', cbId, {nil})
            return
        end
        
        local success, result = pcall(callbacks[name], table.unpack(args or {}))
        
        if not success then
            TriggerEvent('__callback:s2s_result', cbId, {nil})
            return
        end
        
        TriggerEvent('__callback:s2s_result', cbId, {result})
    end)
    
    AddEventHandler('__callback:s2s_result', function(cbId, result)
        if awaitingCallbacks[cbId] then
            awaitingCallbacks[cbId]:resolve(result)
            awaitingCallbacks[cbId] = nil
        end
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
    
    RegisterNetEvent('__callback:c2c_relay', function(cbId, targetId, name, args)
        local src = source
        TriggerClientEvent('__callback:c2c_response', targetId, cbId, src, name, args)
    end)
    
    RegisterNetEvent('__callback:c2c_result', function(cbId, requesterId, result)
        TriggerClientEvent('__callback:clientResult', requesterId, cbId, result)
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
    
    RegisterNetEvent('__callback:clientResult', function(cbId, result)
        if awaitingCallbacks[cbId] then
            awaitingCallbacks[cbId]:resolve(result)
            awaitingCallbacks[cbId] = nil
        end
    end)
    
    RegisterNetEvent('__callback:c2c_response', function(cbId, requesterId, name, args)
        if not callbacks[name] then
            TriggerServerEvent('__callback:c2c_result', cbId, requesterId, {nil})
            return
        end
        
        local success, result = pcall(callbacks[name], requesterId, table.unpack(args or {}))
        
        if not success then
            TriggerServerEvent('__callback:c2c_result', cbId, requesterId, {nil})
            return
        end
        
        TriggerServerEvent('__callback:c2c_result', cbId, requesterId, {result})
    end)
end

local exportCache = {
    register = register,
    awaitServer = awaitServer,
    awaitClient = awaitClient
}

if IsDuplicityVersion() then
    exports('callback', function()
        return exportCache
    end)
else
    exports('callback', function()
        return exportCache
    end)
end