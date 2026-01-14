import { modulesEnabled } from '../../shared/constants'

if (modulesEnabled.chat) {
  import('./elements/chat').then(() => {
    import('./api/chat')
  })
}

if (modulesEnabled.spawn) {
  import('./api/spawn')
}
import('./dom')