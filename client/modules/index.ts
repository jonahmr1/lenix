import { triggerNuiCallback, triggerPromise }from '@trippler/tr_lib/client'

export const showNotification = (message: any) => exports.qbx_core.Notify(message)

export const openJobCenter = () => {
  const jobsProgress = triggerPromise('lenix_jobcenter:server:getProgress')
  triggerNuiCallback('openJobCenter', jobsProgress)
  TriggerScreenblurFadeIn(4000)
}

export const closeJobCenter = () => {
  triggerNuiCallback('closeJobCenter')
  TriggerScreenblurFadeOut(4000)
}