exports.interact:AddInteraction({
  coords = require 'config.client'.ui.coords,
  distance = 8.0,
  interactDst = 2.0,
  id = 'Job',
  options = {
    {
      label = 'Search For A Job',
      action = function()
        exports.tr_jobcenter:OpenJobCenter()
      end
    }
  }
})
