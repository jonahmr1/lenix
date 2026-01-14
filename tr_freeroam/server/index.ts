import { fatal } from '@trippler/tr_lib/shared'
import { modulesEnabled } from '../shared/constants'

if (modulesEnabled.chat) {
  setTimeout(() => {
    if (GetResourceState('chat') !== 'missing')
    fatal(`${GetCurrentResourceName()} will stop running since the resource 'chat' is not missing`)
    else import('./api/chat')
  })
}