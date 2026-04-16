local modules<const> = require 'client/modules/index'

local function isSelfInteraction(citizenid)
  local success<const>, result = lib.triggerPromise('lenix_bossdesk:server:isSelfInteraction', citizenid)
  return result
end

local function notify(...)
  exports.qbx_core:Notify(...)
end

RegisterNetEvent('lenix_bossdesk:client:openDesk', modules.openDesk)

exports('OpenDesk', modules.openDesk)

return {
  isSelfInteraction = isSelfInteraction,
  notify = notify
}