exports.ox_target:addBoxZone({
  coords = require 'config.client'.ui.coords,
  name = 'jobcenter',
  size = vector3(1, 1, 1),
  rotation = 0,
  debug = false,
  options = {
    {
      label = 'Search For A Job',
      onSelect = function()
        exports.tr_jobcenter:OpenJobCenter()
      end
    }
  }
})
