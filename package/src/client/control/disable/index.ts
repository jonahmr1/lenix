import { Bind, isInvalidKey, noop, onKey } from ".."

export default (key: Bind) => {
  if (isInvalidKey(key)) return false

  try {
    setTick(() => onKey(DisableControlAction, key, noop, true) )
  } catch (error) {
    console.error(error)
  }
  return true
}