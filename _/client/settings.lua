lib = exports.tr_lib:require [[@tr_lib/get]]
require = function(arg) return lib.require(arg) end

exports.ox_target:addBoxZone({
  coords = require 'config/client'.ui.coords,
  name = 'jobcenter',
  size = vector3(1, 1, 1),
  rotation = 0,
  debug = false,
  options = {
    {
      label = 'Search For A Job',
      onSelect = function()
        exports.lenix_jobcenter:openJobCenter()
      end
    }
  }
})

exports.tr_kit:createBlip(json.encode(require('config/client').ui.coords), 1)