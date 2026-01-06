import { onNuiCallback } from '@trippler/tr_lib/nui'
import { showNotification, updateData } from '../modules'
import { UpdateDataCB } from '../../../shared/types'

onNuiCallback<[UpdateDataCB]>('updateData', ({players, ranks, stats}) => {
  updateData({players, ranks, stats})
})

onNuiCallback<[string, unknown]>('showNotification', (message, type) => {
  showNotification(message, type)
})

onNuiCallback('openUI', () => {
  showDashboard()
})

const showDashboard = () => {
  document.body.style.display = 'block'
}