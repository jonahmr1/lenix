import { Bind, isInvalidKey, onKey } from ".."

export default (key: Bind, callback: Function) => {
  if (isInvalidKey(key)) return false

  setImmediate(() => {
    while (true) {
      setTick(() => onKey(IsControlJustReleased, key, callback))
    }
  })
  return true
}