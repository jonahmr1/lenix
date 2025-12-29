import './elements/init'
import openDashboard from './modules/openDashboard'
import closeDashboard from './modules/closeGame'
import hideDashboard from './modules/hideDashboard'
import showDashboard from './modules/showDashboard'
import { triggerNuiCallback } from '@trippler/tr_lib/web'

let isDashboardOn = false

window.addEventListener('message', async (event: MessageEvent<any>) => {
  const API = event.data
  const identity: number = API.identity

  if (API.action === 'open') {
    if (typeof identity === 'number') {
      const response = await triggerNuiCallback<boolean>('startCharacterProcess')
      if (!response) return
      openDashboard(identity)
      isDashboardOn = true
    } else {
      openDashboard(identity)
      isDashboardOn = true
    }
  } else {
    if (API.action === 'close') {
      closeDashboard(true)
      isDashboardOn = false
    } else {
      if (API.action === 'hide') {
        hideDashboard()
      } else {
        if (API.action === 'show') {
          showDashboard()
        }
      }
    }
  }
})

window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (isDashboardOn) {
      closeDashboard()
    }
  }
})

import './features'
import './utils/dom/chat'
import useFocus from "./hooks/useFocus"
import createNewMessageForAll from './components/createNewMessageForAll'
import { triggerNuiCallback } from '@trippler/tr_lib/web'

window.addEventListener('message', (event) => {
  if (event.data.action === 'open' && !isFocused) {
    useFocus()
  } else {
    if (event.data.action === 'createNewMessage') {
      createNewMessageForAll(event.data.message, event.data.userRole)
    }
  }
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'F11') {
    triggerNuiCallback<unknown>('focus')
  }
})

export let inCooldown = false
export let messageCount = 0
export let isFocused = false
export let pendingMessageForFadeCount: number[] = []

export const setFocus = (state: boolean) => isFocused = state
export const setMessagesCount = (count: number) => messageCount = count
export const setPendingMessageForFadeCount = (count: number[]) => pendingMessageForFadeCount = count
export const setInCooldown = (state: boolean) => inCooldown = state
