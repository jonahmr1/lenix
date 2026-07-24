local config<const> = require 'shared/constants/index'
local bridge<const> = require 'client/api/index'
local modules<const> = require 'client/modules/index'

CreateThread(function()
  for _, data in ipairs(config.peds) do
    local pedCoords<const> = data.coords
    modules.createPed(data.model, pedCoords, data.scenario)
    bridge.addBoxZone(pedCoords, modules.takeTask, modules.isPlayerFree, modules.abortTask)
  end
end)

AddEventHandler('onResourceStop', function(resourceName)
  if resourceName == GetCurrentResourceName() then
    if not modules.isPlayerFree then
      modules.abortTask()
      modules.setPlayerStatus(false)
    end
  end
end)