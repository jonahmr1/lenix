import { Suggestion } from '../shared/types'
import { modulesEnabled } from '../shared/constants'

if (modulesEnabled.spawn) {
  import('./api/spawn')
  import('./game/spawn')
}
if (modulesEnabled.chat) {
  import('./api/chat')
  import('./nui/chat')
  import('./game/chat')
}

export let DOMLoaded = false
export const earlySuggestionsInsertion: Suggestion[] = []

export const setDOMLoaded = (state: boolean) => DOMLoaded = state