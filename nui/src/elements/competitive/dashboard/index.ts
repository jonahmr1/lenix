import { useDiv } from '@trippler/tr_kit/nui'

useDiv({
  parent: 'body',
  id: 'dashboard-root',
  style: 'select-none hidden absolute z-2 w-full',
})

import('./header')
import('./body')