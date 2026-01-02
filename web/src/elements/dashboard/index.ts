import { useDiv } from '@trippler/tr_kit/web'

useDiv({
  parent: 'body',
  id: 'dashboard-root',
  className: 'select-none hidden absolute z-2',
})

import('./header')
import('./body')