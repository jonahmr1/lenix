local modules<const> = require 'client/modules/index'
local constants<const> = require 'shared/constants/index'

local function addTarget()
  return exports.ox_target:addBoxZone({
    coords = constants.styleConfig.ui.coords,
    name = 'jobcenter',
    size = vec3(1, 1, 1),
    rotation = 0,
    debug = false,
    options = {
      {
        label = 'Search For A Job',
        onSelect = function()
          modules.openJobCenter()
        end
      }
    }
  })
end

exports('openJobCenter', modules.openJobCenter)
exports('closeJobCenter', modules.closeJobCenter)

return {
  addTarget = addTarget
}