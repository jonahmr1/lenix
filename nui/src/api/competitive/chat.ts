import { PlayerObject } from '../../../../shared/types/competitive'
import createNewMessageForAll from '../../modules/competitive/chat/createNewMessageForAll'
import useFocus from '../../modules/competitive/chat/openChat'
import { onNuiCallback } from '@trippler/tr_lib/nui'

onNuiCallback('competitive/chat/openChat', useFocus)

onNuiCallback('competitive/chat/createNewMessage', (message: string, userRole: PlayerObject) => createNewMessageForAll(message, userRole))