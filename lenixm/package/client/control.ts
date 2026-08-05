import { palette } from '../shared'
import type { binds } from './_init'

type Bind = keyof typeof binds

const isInvalidKey = (key: Bind) => {
  if (!binds[key]) {
    console.log(palette('pink', `Invalid control key passed: ${key}`))
    return true
  }
}

const getKeyByIndex = (index: number) => {
  for (const key of Object.keys(binds)) {
    for (const value of binds[key as Bind]) {
      if (value == index) {
        return key
      }
    }
  }
}

const onKey = (Function: Function, key: Bind, callback: Function, ...parameters: any) => {
  for (const index of binds[key]) {
    if (Function(0, index, ...parameters)) {
      if (callback) {
        callback()
      }
      break
    }
  }
}

const onReleased = (key: Bind, callback: Function) => {
  if (isInvalidKey(key)) return false
  try {
    setTick(() => onKey(IsControlReleased, key, callback))
  } catch (error) {
    console.error(error)
  }
  return true
}

const onRelease = (key: Bind, callback: Function) => {
  if (isInvalidKey(key)) return false

  try {
    setTick(() => onKey(IsControlJustReleased, key, callback))
  } catch (error) {
    console.error(error)
  }
  return true
}

const onPress = (key: Bind, callback: Function) => {
  if (isInvalidKey(key)) return false

  try {
    setTick(() => onKey(IsControlJustPressed, key, callback))
  } catch (error) {
    console.error(error)
  }
  return true
}


const onHold = (key: Bind, callback: Function) => {
  if (isInvalidKey(key)) return false

  try {
    setTick(() => onKey(IsControlPressed, key, callback))
  } catch (error) {
    console.error(error)
  }
  return true
}

const onDisabled = (key: Bind, callback: Function) => {
  if (isInvalidKey(key)) return false

  try {
    setTick(() => {
      onKey(DisableControlAction, key, noop, true)
      onKey(IsDisabledControlJustPressed, key, callback)
    })
  } catch (error) {
    console.error(error)
  }
  return true
}

const disable = (key: Bind) => {
  if (isInvalidKey(key)) return false

  try {
    setTick(() => onKey(DisableControlAction, key, noop, true) )
  } catch (error) {
    console.error(error)
  }
  return true
}

export const control = {
	
}