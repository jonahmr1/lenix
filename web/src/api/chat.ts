import { isFocused } from '../utils/dashboard/variables'
import { PlayerObject } from '../../../shared/types'
import createNewMessageForAll from '../components/chat/createNewMessageForAll'
import useFocus from '../hooks/chat/useFocus'
import { onNuiCallback } from '@trippler/tr_lib/web'

onNuiCallback('open', () => {
  if (isFocused) return
  useFocus()
})

onNuiCallback<[ message: string, userRole: PlayerObject ]>('createNewMessage', (message, userRole) => {
  createNewMessageForAll(message, userRole)
})