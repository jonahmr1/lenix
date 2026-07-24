import { nuiFocus, onNuiCallback } from '@trippler/tr_lib/nui'
import { hideDashboard, initializeUI, showUI } from '../modules'
import { JobConfig } from '../../../shared/types'

onNuiCallback(`openJobCenter`, (jobsProgress: JobConfig["progress"]) => {
  showUI(jobsProgress)
  nuiFocus(true, true)
})

onNuiCallback(`closeJobCenter`, () => {
  initializeUI()
  hideDashboard()
  nuiFocus(true, true)
})