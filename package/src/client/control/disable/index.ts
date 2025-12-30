import { Bind, isInvalidKey, noop, onKey } from ".."

export default (key: Bind,) => {
  if (isInvalidKey(key)) return false

  setTick(() => onKey(DisableControlAction, key, noop, true) )
  return true
}