lib.control = {}
local binds<const> = lib.require 'binds'

local noop<const> = function() end

local onKey<const> = function(Function, key, callback, ...)
  for _, index in ipairs(binds[key]) do
    if Function(0, index, ...) then
      if callback then
        callback()
      end
      break
    end
  end
end

local isInvalidKey<const> = function(key)
  if not binds[key] then
    lib.console.info('Invalid control key passed: ' .. key)
    return true
  end
end

local getKeyByIndex<const> = function(index)
  for key, values in pairs(binds) do
    for _, value in ipairs(values) do
      if value == index then
        return key
      end
    end
  end
end

---@param key ControlKey
---@param callback fun()
---@return boolean
function lib.control.onPress(key, callback)
  if isInvalidKey(key) then return false end
  CreateThread(function()
    lib.Repeat(function ()
      onKey(IsControlJustPressed, key, callback)
    end)
  end)
  return true
end

---@param key ControlKey
---@param callback fun()
---@return boolean
function lib.control.onHold(key, callback)
  if isInvalidKey(key) then return false end
  CreateThread(function()
    lib.Repeat(function ()
      onKey(IsControlPressed, key, callback)
    end)
  end)
  return true
end

---@param key ControlKey
---@param callback fun()
---@return boolean
function lib.control.onRelease(key, callback)
  if isInvalidKey(key) then return false end
  CreateThread(function()
    lib.Repeat(function ()
      onKey(IsControlJustReleased, key, callback)
    end)
  end)
  return true
end

---@param key ControlKey
---@param callback fun()
---@return boolean
function lib.control.onReleased(key, callback)
  if isInvalidKey(key) then return false end
  CreateThread(function()
    lib.Repeat(function ()
      onKey(IsControlReleased, key, callback)
    end)
  end)
  return true
end

---@param key ControlKey
---@return boolean
function lib.control.disable(key)
  if isInvalidKey(key) then return false end
  CreateThread(function()
    lib.Repeat(function ()
      onKey(DisableControlAction, key, nil, true)
    end)
  end)
  return true
end

---@param key ControlKey
---@param callback function
function lib.control.onDisabled(key, callback)
    if isInvalidKey(key) then return false end

    CreateThread(function()
      lib.Repeat(function ()
        onKey(DisableControlAction, key, noop, true)
        onKey(IsDisabledControlJustPressed, key, callback)
      end)
    end)

    return true
end

---@param index number # Range: 0-360
---@return boolean
---@deprecated turns out the game engine disable all the indexes related to this index's key, if index 200 (ESC) is disabled, then all of the other indexes that are in the same KEY (ESC) will also get disabled. simply rockstar :)
function lib.control.disableByIndex(index)
  if index < 0 or index > 360 then
    lib.console.info('Invalid control index passed: ' .. index)
    return false
  end
  CreateThread(function()
    while true do
      onKey(DisableControlAction, getKeyByIndex(index), nil, true)
      Wait(0)
    end
  end)
  return true
end
