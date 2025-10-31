lib = exports.tr_lib:require [[@tr_lib/init]]
require = function(arg) return lib.require(arg) end
local config = require 'config/client'

function PlayerLeveledUp(levelAfter)
  print("Level Up! Now level " .. levelAfter)
end

function PlayerGradedUp(gradeAfter)
  print("Promoted! New grade: " .. gradeAfter)
end

local ped = exports.tr_kit:createSinglePed('ig_talcc', json.encode(vec4(config.ui.coords)), {name = 'WORLD_HUMAN_LEANING', timeToLeave = 1000, playIntroClip = false})
AddEventHandler('onResourceStop', function(resourceName)
  if GetCurrentResourceName() == resourceName then
    exports.tr_kit:clearCreatedPed(ped)
  end
end)