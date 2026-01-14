import './api/onboarding'
import { config } from '../shared/constants'

if (config.competitive) {
  import('./database/competitive')
  import('./api/competitive/dashboard')
  import('./api/competitive/chat')
}

if (config.freeroam) {
  const { fatal } = await import('@trippler/tr_lib/shared')
  const { modulesEnabled } = await import('../shared/constants/freeroam')
  
  if (modulesEnabled.chat) { setTimeout(() => {
    if (GetResourceState('chat') !== 'missing')
      fatal(`${GetCurrentResourceName()} will stop running since the resource 'chat' is not missing`)
    else import('./api/freeroam/chat')
  })
}
}