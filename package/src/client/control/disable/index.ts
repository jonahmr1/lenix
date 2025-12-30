import { Bind, isInvalidKey, noop, onKey } from ".."

export default (key: Bind,) => {
  if (isInvalidKey(key)) return false

  setImmediate(() => {
    while (true) {
      setTick(() => onKey(DisableControlAction, key, noop, true) )
    }
  })
  return true
}