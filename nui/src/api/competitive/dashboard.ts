import { RemoveIncomingRequest } from "../../../../shared/types/competitive"
import { onNuiCallback, triggerNuiCallback } from '@trippler/tr_lib/nui'
import { closeDashboard, hideDashboard, showDashboard } from "../../../../tr_competitive/nui/src/modules/dashboard"
import openDashboard from "../../../../tr_competitive/nui/src/modules/dashboard/openDashboard"

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