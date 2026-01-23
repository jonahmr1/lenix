import { onNuiCallback } from '@trippler/tr_lib/nui'
import generateCSS from './elements/postloader'
import { generateContext, Init } from './modules'

try {
  if (window.frameElement) {
    window.frameElement.style.zIndex = '99999'
    window.frameElement.style.position = 'fixed'
  }
} catch(e) {}

generateCSS()
generateContext()
onNuiCallback('init', () => Init())