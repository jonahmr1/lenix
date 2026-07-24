import { RemoveIncomingRequest } from "../../../../shared/types/competitive"
import { onNuiCallback, triggerNuiCallback } from '@trippler/tr_lib/nui'
import { closeDashboard, hideDashboard, showDashboard } from "../../modules/competitive/dashboard"
import openDashboard from "../../modules/competitive/dashboard/openDashboard"

onNuiCallback('competitive/dashboard/open', async (identity) => {
  openDashboard(identity)
})

onNuiCallback('competitive/dashboard/close', () => {
  closeDashboard(true)
})

onNuiCallback('competitive/dashboard/hide', () => {
  hideDashboard()
})

onNuiCallback('competitive/dashboard/show', () => {
  showDashboard()
})

export const removeIncomingRequest = (identity: number) => triggerNuiCallback<RemoveIncomingRequest>('competitive/dashboard/removeIncomingRequest', { identity })