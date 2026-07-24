declare global {
  const GetParentResourceName: () => string
}

import './dom'
export { default as onNuiCallback } from './onNuiCallback'
export { default as triggerNuiCallback } from './triggerNuiCallback'
export { default as nuiFocus } from './nuiFocus'