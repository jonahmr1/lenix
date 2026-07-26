local api<const> = require 'client/api/index'
local constants<const> = require 'shared/constants/index'
local utils<const> = require 'shared/utils/index'
local states<const> = require 'client/states/index'
local kit<const> = require '@trippler/tr_kit/client'

local function createPeds()
  for key, value in pairs(constants.settings) do
    if key ~= "_DEFAULT" then
      local fallbackSettings = constants.settings._DEFAULT.PEDS
      for _, pedElement in ipairs(value.PEDS.peds) do
        local pedSettings = utils.tableFiller(fallbackSettings, pedElement)
        local handle, netId = kit.createSinglePed(pedSettings)
        
        AddEventHandler('onResourceStop', function(resourceName)
          if resourceName == GetCurrentResourceName() then
            kit.destroyCreatedPed(netId)
          end
        end)
      end
    end
  end
end

local function createInteractions()
  for key, value in pairs(constants.settings) do
    if key ~= "_DEFAULT" then
      for _, pedElement in ipairs(value.PEDS.peds) do
        local zoneName = string.format("lenix_vehicles_%s_%s_%s_%s", key, pedElement.coords[1], pedElement.coords[2], pedElement.coords[3])
        local interactions = utils.tableFiller(constants.settings._DEFAULT.INTERACTIONS, constants.settings[key].INTERACTIONS)
        api.bridge.target(zoneName, pedElement, interactions, key)
      end
    end
  end
end

local function returnVehicle()
  local ped = PlayerPedId()
  local closestVehicleHandle = lib.closestVehicle(ped, 10.0)
  if not closestVehicleHandle then return end
  
  local closestVehicleNetId = NetworkGetNetworkIdFromEntity(closestVehicleHandle)
  local response = kit.destroyCreatedVehicle(closestVehicleNetId) -- Corrected from destroyCreatedPed
  
  if not response then
    api.bridge.notify('Failed to return the vehicle, please try again later', 'error')
    return
  end

  local currentReqs = states.getState.netIdsRequested
  for i, id in ipairs(currentReqs) do
    if id == closestVehicleNetId then
      table.remove(currentReqs, i)
      break
    end
  end
  states.setState.netIdsRequested(currentReqs)
end

return {
  createPeds = createPeds,
  createInteractions = createInteractions,
  returnVehicle = returnVehicle
}