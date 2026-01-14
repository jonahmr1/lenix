import './api/onboarding'
import './nui/onboarding'
import './game/onboarding'
import { openMainMenu } from './nui/onboarding'
import { onDOMLoaded } from '@trippler/tr_lib/client'
import { fatal } from '@trippler/tr_lib/shared'
import { config } from '../shared/constants'

const isQboxCharactersHandlerDisabled = globalThis.exports[GetCurrentResourceName()].isQboxCharactersHandlerDisabled()

onDOMLoaded(() => {
  if (!isQboxCharactersHandlerDisabled) fatal('Qbox characters handler is enabled')
  const tick = setTick(() => {
    if (NetworkIsSessionStarted()) {
      openMainMenu()
      clearTick(tick)
    }
  })
})

if (config.competitive) {
  import('./api/competitive/dashboard')
  import('./api/competitive/chat')
  import('./nui/competitive/chat')
  import('./game/competitive/chat')
}

if (config.freeroam) {
  (async () => {
    const { modulesEnabled } = await import('../shared/constants/freeroam')
    if (modulesEnabled.spawn) {
      import('./api/freeroam/spawn')
      import('./modules/freeroam/spawn')
    }
    if (modulesEnabled.chat) {
      import('./api/freeroam/chat')
      import('./nui/freeroam/chat')
      import('./modules/freeroam/chat')
    }
  })()
}