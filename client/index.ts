import './api'
import './nui'
import { triggerNuiCallback } from '@trippler/tr_lib/client'

on('onResourceStop', (resourceName: string) => {
  if (resourceName === GetCurrentResourceName()) {
    emitNet('tr_onboarding/server/logout')
  }
})

export default (arg: object) => triggerNuiCallback(arg)

import { showGame, hideGame, closeGame, openGame } from './game'

globalThis.exports('showGame', showGame)
globalThis.exports('hideGame', hideGame)
globalThis.exports('closeGame', closeGame)
globalThis.exports('start', openGame)