import { useDiv } from '@trippler/tr_kit/nui'

useDiv({
  parent: 'body',
  id: 'dashboard-root',
  style: 'select-none hidden absolute z-2',
})

import('./header')
import('./body')