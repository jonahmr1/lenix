import { toggleMenu,  } from '../../modules/onboarding'
import { onNuiCallback } from '@trippler/tr_lib/nui'

onNuiCallback('onboarding/openMainMenu', toggleMenu)

onNuiCallback('onboarding/closeMainMenu', () => toggleMenu(false))