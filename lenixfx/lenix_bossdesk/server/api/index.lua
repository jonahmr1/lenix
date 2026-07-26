local services<const> = require 'server/services/index'

lib.onPromise('lenix_bossdesk:server:isPlayerBoss', services.isPlayerBoss)
lib.onPromise('lenix_bossdesk:server:getJobPlayersData', services.getJobPlayersData)
lib.onPromise('lenix_bossdesk:server:getJobBudget', services.getSocietyBudget)
lib.onPromise('lenix_bossdesk:server:getTotalPlayers', services.getTotalPlayers)
lib.onPromise('lenix_bossdesk:server:getJobOnlinePlayers', services.getJobOnlinePlayers)
lib.onPromise('lenix_bossdesk:server:getJobRanks', services.getJobRanks)
lib.onPromise('lenix_bossdesk:server:isSelfInteraction', services.isSelfInteraction)
lib.onPromise('lenix_bossdesk:server:hirePlayer', services.hirePlayer)
lib.onPromise('lenix_bossdesk:server:firePlayer', services.firePlayer)
lib.onPromise('lenix_bossdesk:server:updateReputation', services.updateReputation)
lib.onPromise('lenix_bossdesk:server:transferFunds', services.transferFunds)
lib.onPromise('lenix_bossdesk:server:manageFunds', services.manageFunds)

SetTimeout(0, function()
  exports.ox_inventory:RegisterStash(GetInvokingResource() .. '_managment_stash', 'Police Stash', 250, 1000000, nil, {['police'] = 0}, nil)
end)