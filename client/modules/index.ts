import { triggerNuiCallback, triggerPromise } from "@trippler/tr_lib/client"
import { isSelfInteraction, notify } from "../api"
import { Types, UpdateDataCB } from "../../shared/types"
import { fatal } from "@trippler/tr_lib/shared"

const showNotification = (message: string, type: unknown) => {
  triggerNuiCallback('showNotification', message, type)
}

const refreshUIData = async () => {
  const players = await triggerPromise<Types["JobPlayersData"]>('lenix_bossdesk:server:getJobPlayersData')
  const ranks = await triggerPromise<Types["JobRanks"]>('lenix_bossdesk:server:getJobRanks')
  const stats = {
    budget: await triggerPromise<Types["SocietyBudget"]>('lenix_bossdesk:server:getJobBudget'),
    totalPlayers: await triggerPromise<Types["TotalPlayers"]>('lenix_bossdesk:server:getTotalPlayers'),
    activePlayers: await triggerPromise<Types["JobOnlinePlayers"]>('lenix_bossdesk:server:getJobOnlinePlayers')
  }
  if (typeof stats.budget === 'number' && typeof stats.totalPlayers === 'number' && typeof stats.activePlayers === 'number') {
    triggerNuiCallback('updateData', {
      players,
      ranks,
      stats: {
        budget: stats.budget,
        totalPlayers: stats.totalPlayers, 
        activePlayers: stats.activePlayers 
      } 
    } satisfies UpdateDataCB)
  } else fatal(`Failed to fetch valid stats data: ${JSON.stringify(stats)}`)
}

export const openDesk = async () => {
  const isBoss = await triggerPromise<Types["IsPlayerBoss"]>('lenix_bossdesk:server:isPlayerBoss')
  if (isBoss) {
    triggerNuiCallback('openUI')
    refreshUIData()
    SetNuiFocus(true, true)
  } else {
    notify('Access Denied', 'error', 5000, 'You are not authorized to access the police desk.')
  }
}

export const hirePlayer = async (citizenid: string, grade: any, callsign: any) => {
  const awaitedIsSelfInteraction = await isSelfInteraction(citizenid)
  if (awaitedIsSelfInteraction) return showNotification('Are you kidding me?!', 'error')
  else {
    const [success, message] = await triggerPromise<Types["HirePlayer"]>('lenix_bossdesk:server:hirePlayer', citizenid, grade, callsign)
    if (success) {
      showNotification(message || 'Employee hired successfully!', 'success')
      refreshUIData()
    } else {
      showNotification(message || 'Failed to hire player!', 'error')
    }
  }
}

export const firePlayer = async (citizenid: string, reason: string) => {
  const awaitedIsSelfInteraction = await isSelfInteraction(citizenid)
  if (awaitedIsSelfInteraction) return showNotification('Bruh!', 'error')
  const [success, message] = await triggerPromise<Types["FirePlayer"]>('lenix_bossdesk:server:firePlayer', citizenid, reason)
  if (success) {
    showNotification(message || 'Employee fired successfully!', 'success')
    refreshUIData()
  } else {
    showNotification(message || 'Failed to fire player!', 'error')
  }
}

export const updateReputation = async (citizenid: string, action: string, points: number) => {
  const [success, message] = await triggerPromise<Types["UpdateReputation"]>('lenix_bossdesk:server:updateReputation', citizenid, action, points)
  if (success) {
    const actionText = action == "commendation" && "Commendation added" || 
        action == "warning" && "Warning issued" || 
        "Suspension applied"
    showNotification(message || actionText + ' successfully!', 'success')
    refreshUIData()
  } else {
    showNotification(message || 'Failed to update reputation!', 'error')
  }
}

export const transferFunds = async (citizenid: string, reason: string, amount: number) => {
  const [success, message] = await triggerPromise<Types["TransferFunds"]>('lenix_bossdesk:server:transferFunds', citizenid, reason, amount)
  if (success) {
    showNotification(message || ('$' + amount + ' transferred successfully!'), 'success')
    refreshUIData()
  } else {
    showNotification(message || 'Transfer failed! Insufficient funds or error.', 'error')
  }
}

export const manageFunds = async (action: string, amount: number, reason: string) => {
  const [success, message] = await triggerPromise<Types["ManageFunds"]>('lenix_bossdesk:server:manageFunds', action, amount, reason)
  if (success) {
    const actionText = action == "deposit" && "deposited to" || "withdrawn from"
    showNotification(message || ('$' + amount + ' ' + actionText + ' department budget!'), 'success')
    refreshUIData()
  } else {
    showNotification(message || 'Budget transaction failed!', 'error')
  }
}

export const openStash = () => {
  exports.ox_inventory.openInventory('stash', 'lenixbossdesk_managment_stash')
}