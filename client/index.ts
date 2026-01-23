import { onDOMLoaded, triggerNuiCallback } from '@trippler/tr_lib/client'

onDOMLoaded(() => {
  const interval = setInterval(() => {
    if (NetworkIsSessionStarted()) {
      triggerNuiCallback('init')
      clearInterval(interval)
    }
  }, 500)
})