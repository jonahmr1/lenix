import './api/onboarding'





import '../../server/database/competitive'
import '../../server/api/competitive/dashboard'
import '../../server/api/competitive/chat'





import { fatal } from '@trippler/tr_lib/shared'
import { modulesEnabled } from '../shared/constants/onboarding'

if (modulesEnabled.chat) {
  setTimeout(() => {
    if (GetResourceState('chat') !== 'missing')
    fatal(`${GetCurrentResourceName()} will stop running since the resource 'chat' is not missing`)
    else import('../../server/api/freeroam/chat')
  })
}