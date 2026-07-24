import { Bind, isInvalidKey, noop, onKey } from ".."

export default (key: Bind, callback: Function) => {
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