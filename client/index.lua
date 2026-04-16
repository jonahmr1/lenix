local states<const> = require 'client/states/index'
local modules<const> = require 'client/modules/index'

local function Initialization(currentJob)
  states.setState.playerJob(currentJob)
  modules.createPeds()
  modules.createInteractions()
end

local function IsZoneFree(zone)
  -- tr_lib is global via shared_script
  local response = tr_lib.init().isZoneClear(zone, 2, { PlayerPedId() })
  return response
end

return {
  Initialization = Initialization,
  IsZoneFree = IsZoneFree
}