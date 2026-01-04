import { PlayerObject } from '../../../shared/types'
import createNewMessageForAll from '../modules/chat/createNewMessageForAll'
import useFocus from '../modules/chat/openChat'
import { onNuiCallback } from '@trippler/tr_lib/nui'

onNuiCallback('chat/openChat', () => {
  useFocus()
})

onNuiCallback<[ string, PlayerObject ]>('chat/createNewMessage', (message, userRole) => {
  createNewMessageForAll(message, userRole)
})