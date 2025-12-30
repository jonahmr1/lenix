import { useDiv } from '@trippler/tr_kit/web'
import('./header')
import('./body')

useDiv({
  id: 'dashboard-root',
  className: 'select-none hidden',
  parent: 'body'
})