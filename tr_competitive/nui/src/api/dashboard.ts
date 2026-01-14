import { RemoveIncomingRequest } from "../../../shared/types"
import { onNuiCallback, triggerNuiCallback } from '@trippler/tr_lib/nui'
import { closeDashboard, hideDashboard, showDashboard } from "../modules/dashboard"
import openDashboard from "../modules/dashboard/openDashboard"

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