local config<const> = require 'shared.constants/index'
local api<const> = require 'client/api/vitals/index'

local vitals<const> = config.vitals
local entityHealth, entityArmour
local updateInterval

local function isPlayerAlive()
  local playerData<const> = api.getFxPlayerData()
  local isAlive<const> = not (playerData.metadata['inlaststand'] or playerData.metadata['isdead'])
  return isAlive
end

local function showVitals()
  if updateInterval then
    ClearInterval(updateInterval)
  end

  local isAlive = isPlayerAlive()
  entityHealth = isAlive and (GetEntityHealth(PlayerPedId()) / 2) or 0
  entityArmour = GetPedArmour(PlayerPedId())
  
  lib.triggerNuiCallback('showVitals', entityHealth, entityArmour)
  
  updateInterval = SetInterval(function()
    local currentEntityHealth<const> = entityHealth
    local currentEntityArmour<const> = entityArmour
    local alive = isPlayerAlive()
    
    entityHealth = alive and (GetEntityHealth(PlayerPedId()) / 2) or 0
    entityArmour = GetPedArmour(PlayerPedId())
    
    if currentEntityHealth ~= entityHealth or currentEntityArmour ~= entityArmour then
      lib.triggerNuiCallback('updateVitalsBars', entityHealth, entityArmour)
    end
  end, vitals.refreshInterval)
end

local function hideVitals()
  if updateInterval then
    ClearInterval(updateInterval)
    updateInterval = nil
  end
  
  SetTimeout(1000, function()
    lib.triggerNuiCallback('hideVitals')
  end)
end

return {
  showVitals = showVitals,
  hideVitals = hideVitals
}