import { PlayerObject } from '../../../../shared/types/competitive'
import createNewMessageForAll from '../../../../tr_competitive/nui/src/modules/chat/createNewMessageForAll'
import useFocus from '../../../../tr_competitive/nui/src/modules/chat/openChat'
import { onNuiCallback } from '@trippler/tr_lib/nui'

onNuiCallback('chat/openChat', () => {
  useFocus()
})

onNuiCallback('chat/createNewMessage', (message: string, userRole: PlayerObject) => {
  createNewMessageForAll(message, userRole)
})