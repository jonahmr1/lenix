local vitalsEnabled<const> = config.vitals.enabled
local weaponaryEnabled<const> = config.weaponary.enabled

if vitalsEnabled and weaponaryEnabled then
  require 'client/api/vitals/index'
  require 'client/api/weaponary/index'
  local vitals<const> = require 'client/modules/vitals'
  local weaponary<const> = require 'client/modules/weaponary'

  exports('showHud', function()
    vitals.showVitals()
    weaponary.showWeaponary()
  end)

elseif weaponaryEnabled then
  require 'client/api/weaponary/index'
  local weaponary<const> = require 'client/modules/weaponary'

  exports('showHud', weaponary.showWeaponary)

elseif vitalsEnabled then
  require 'client/api/vitals/index'
  local vitals<const> = require 'client/modules/vitals'

  exports('showHud', vitals.showVitals)
end