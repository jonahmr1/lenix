import { trace } from '../../shared'
import binds from './binds.json'

export type Bind = keyof typeof binds
export const noop = () => {}

export const onKey = (Function: Function, key: Bind, callback: Function, ...parameters: any) => {
  for (const index of binds[key]) {
    if (Function(0, index, ...parameters)) {
      if (callback) {
        callback()
      }
      break
    }
  }
}

export const isInvalidKey = (key: Bind) => {
  if (!binds[key]) {
    trace(`Invalid control key passed: ${key}`)
    return true
  }
}

export const getKeyByIndex = (index: number) => {
  for (const key of Object.keys(binds)) {
    for (const value of binds[key as Bind]) {
      if (value == index) {
        return key
      }
    }
  }
}

import disable from './disable'
import onDisabled from './onDisabled'
import onHold from './onHold'
import onPress from './onPress'
import onRelease from './onRelease'
import onReleased from './onReleased'

export default { disable, onDisabled, onHold, onPress, onRelease, onReleased }