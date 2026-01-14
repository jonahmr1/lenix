import './elements'
import './api'
import { config } from '../../shared/constants'

document.body.id = 'body'
document.body.style = 'relative'

if (config.competitive) {
  import('./elements/competitive/dashboard')
  import('./api/competitive/dashboard')
  import('./dom/competitive/dashboard')
  // import('./elements/chat')
  // import('./api/chat')
  // import('./dom/chat')
}

if (config.freeroam) {
  const { modulesEnabled } = await import('../../shared/constants/freeroam')

  if (modulesEnabled.chat) {
    import('./elements/freeroam/chat').then(() => {
      import('./api/freeroam/chat')
    })
  }

  if (modulesEnabled.spawn) {
    import('./api/freeroam/spawn')
  }
  import('./dom/freeroam')
}