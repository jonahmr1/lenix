import { toggleMenu,  } from '../../modules/onboarding'
import { onNuiCallback } from '@trippler/tr_lib/nui'

onNuiCallback('openMainMenu', () => {
  toggleMenu(true)
})

onNuiCallback('closeMainMenu', () => {
  toggleMenu(false)
})