local api<const> = require 'client/api/index'
local kit<const> = require '@trippler/tr_kit/client'
-- Assuming styleConfig is in shared/constants
local constants<const> = require 'shared/constants/index'

SetTimeout(0, function()
  api.addTarget()
  
  -- Create Blip
  kit.createBlip(constants.styleConfig.ui.coords, 1)

  -- Create Job Center Ped
  local _, pedNetId = kit.createSinglePed({
    hash = GetHashKey('ig_talcc'),
    coords = constants.styleConfig.ui.coords,
    scenario = {
      name = 'WORLD_HUMAN_LEANING', 
      timeToLeave = 1000, 
      playIntroClip = false
    }
  })

  AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then 
      kit.destroyCreatedPed(pedNetId) 
    end
  end)
end)