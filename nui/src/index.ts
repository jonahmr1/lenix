import './elements'
import './api'









document.body.id = 'body'
document.body.style = 'relative'

import('./elements/dashboard')
import('../../../nui/src/api/competitive/dashboard')
import('../../../nui/src/dom/competitive/dashboard')
// import('./elements/chat')
// import('./api/chat')
// import('./dom/chat')








import { modulesEnabled } from '../../../shared/constants/freeroam'

if (modulesEnabled.chat) {
  import('./elements/chat').then(() => {
    import('../../../nui/src/api/freeroam/chat')
  })
}

if (modulesEnabled.spawn) {
  import('../../../nui/src/api/freeroam/spawn')
}
import('../../../nui/src/dom/freeroam')