local core<const> = require 'client/index'
local modules<const> = require 'client/modules/index'
local states<const> = require 'client/states/index'
-- ox_lib is assumed global per your previous instructions
local qb = exports['qb-core']:GetCoreObject()

local bridge<const> = {
  getVehicles = function(key) 
    return exports.qbx_core:GetVehiclesByName(key) 
  end,
  getPlayerJob = function()
    local playerJob = qb.Functions.GetPlayerData().job
    return { name = playerJob.name, gradeLevel = playerJob.grade.level }
  end,
  getPlayerGang = function()
    local playerGang = qb.Functions.GetPlayerData().gang
    return { name = playerGang.name, gradeLevel = playerGang.grade.level }
  end,
  notify = function(message, type) 
    exports.qbx_core:Notify(message, type) 
  end,
  target = function(zoneName, pedElement, interactions, key)
    local Menu<const> = require 'client/api/menu'
    exports.ox_target:addBoxZone({
      coords = vec3(pedElement.coords[1], pedElement.coords[2], pedElement.coords[3]),
      name = zoneName,
      size = vec3(3.45, 3.35, 2.0),
      rotation = pedElement.coords[4],
      debug = interactions.debug,
      options = {
        {
          label = interactions.take.label,
          groups = (interactions.targets and (interactions.targets.job or interactions.targets.gang)) and {
            interactions.targets.job,
            interactions.targets.gang
          } or nil,
          distance = interactions.take.distance,
          onSelect = function()
            Menu.mainMenu(key)
          end
        },
        {
          label = interactions.back.label,
          groups = (interactions.targets and (interactions.targets.job or interactions.targets.gang)) and {
            interactions.targets.job,
            interactions.targets.gang
          } or nil,
          distance = interactions.take.distance,
          canInteract = function()
            return #states.getState.netIdsRequested ~= 0
          end,
          onSelect = function()
            modules.returnVehicle()
          end
        }
      }
    })
  end,
  menu = {
    open = function(main, options)
      local mappedOptions = {}
      for i = 1, #options do
        table.insert(mappedOptions, {
          title = options[i].title,
          description = options[i].description,
          icon = options[i].icon,
          disabled = options[i].restricted,
          image = options[i].image,
          onSelect = function() options[i].onClick() end,
        })
      end

      lib.registerContext({
        id = main.id,
        title = main.header,
        options = mappedOptions
      })
      lib.showContext(main.id)
    end,
    close = function() lib.hideContext(false) end
  },
  drawText = {
    show = function() exports['qb-core']:DrawText('⇽', 'right') end,
    hide = function() exports['qb-core']:HideText() end
  }
}

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
  local pData = qb.Functions.GetPlayerData()
  core.Initialization(pData.job)
end)

return {
  bridge = bridge,
  qb = qb
}