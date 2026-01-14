import { RemoveIncomingRequest } from "../../../../shared/types/competitive"
import { onNuiCallback, triggerNuiCallback } from '@trippler/tr_lib/nui'
import { closeDashboard, hideDashboard, showDashboard } from "../../modules/competitive/dashboard"
import openDashboard from "../../modules/competitive/dashboard/openDashboard"

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