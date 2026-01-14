import './api/onboarding'
import './nui/onboarding'
import './game/onboarding'
import { openMainMenu } from './nui/onboarding'
import { onDOMLoaded } from '@trippler/tr_lib/client'
import { fatal } from '@trippler/tr_lib/shared'

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


import './api/competitive/dashboard'
import './api/competitive/chat'
import './nui/competitive/dashboard'
import './nui/competitive/chat'
import './game/competitive/dashboard'
import './game/competitive/chat'





import { Suggestion } from '../shared/types/onboarding'
import { modulesEnabled } from '../shared/constants/onboarding'

if (modulesEnabled.spawn) {
  import('../../client/api/freeroam/spawn')
  import('../../client/modules/freeroam/spawn')
}
if (modulesEnabled.chat) {
  import('../../client/api/freeroam/chat')
  import('../../client/nui/freeroam/chat')
  import('../../client/modules/freeroam/chat')
}

export let DOMLoaded = false
export const earlySuggestionsInsertion: Suggestion[] = []

export const setDOMLoaded = (state: boolean) => DOMLoaded = state
export const isIterable = (obj: any) => obj != null && typeof obj[Symbol.iterator] === 'function'
