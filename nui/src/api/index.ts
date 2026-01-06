import { nuiFocus, onNuiCallback } from '@trippler/tr_lib/nui'
import { hideDashboard, initializeUI, showUI } from '../modules'

onNuiCallback(`openJobCenter`, (jobsProgress) => {
  showUI()
  nuiFocus(true, true)
})

onNuiCallback(`closeJobCenter`, () => {
  initializeUI()
  hideDashboard()
  nuiFocus(true, true)
})