import { RemoveIncomingRequest } from "../../../shared/types"
import openDashboard from '../modules/dashboard/states/openDashboard'
import closeDashboard from '../modules/dashboard/states/closeDashboard'
import hideDashboard from '../modules/dashboard/states/hideDashboard'
import showDashboard from '../modules/dashboard/states/showDashboard'
import { onNuiCallback, triggerNuiCallback } from '@trippler/tr_lib/web'

onNuiCallback('dashboard/open', async (identity) => {
  openDashboard(identity)
})

onNuiCallback('dashboard/close', () => {
  closeDashboard(true)
})

onNuiCallback('dashboard/hide', () => {
  hideDashboard()
})

onNuiCallback('dashboard/show', () => {
  showDashboard()
})

export const removeIncomingRequest = (identity: number) => triggerNuiCallback<RemoveIncomingRequest>('dashboard/removeIncomingRequest', { identity })