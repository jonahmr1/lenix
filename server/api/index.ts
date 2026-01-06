import { onPromise } from '@trippler/tr_lib/server'
import { firePlayer, getJobOnlinePlayers, getJobPlayersData, getJobRanks, getSocietyBudget, getTotalPlayers, hirePlayer, isPlayerBoss, isSelfInteraction, manageFunds, transferFunds, updateReputation } from '../services'

onPromise('lenix_bossdesk:server:isPlayerBoss', isPlayerBoss)
onPromise('lenix_bossdesk:server:getJobPlayersData', getJobPlayersData)
onPromise('lenix_bossdesk:server:getJobBudget', getSocietyBudget)
onPromise('lenix_bossdesk:server:getTotalPlayers', getTotalPlayers)
onPromise('lenix_bossdesk:server:getJobOnlinePlayers', getJobOnlinePlayers)
onPromise('lenix_bossdesk:server:getJobRanks', getJobRanks)
onPromise('lenix_bossdesk:server:isSelfInteraction', isSelfInteraction)
onPromise('lenix_bossdesk:server:hirePlayer', hirePlayer)
onPromise('lenix_bossdesk:server:firePlayer', firePlayer)
onPromise('lenix_bossdesk:server:updateReputation', updateReputation)
onPromise('lenix_bossdesk:server:transferFunds', transferFunds)
onPromise('lenix_bossdesk:server:manageFunds', manageFunds)

setImmediate(() => {
  exports.ox_inventory.RegisterStash(GetCurrentResourceName() + '_managment_stash', 'Police Stash', 250, 1000 * 1000, null, {['police']: 0}, null)
})