import { Bind, isInvalidKey, onKey } from ".."

export default (key: Bind, callback: Function) => {
  if (isInvalidKey(key)) return false
  setImmediate(() => {
    while (true) {
      try {
        setTick(() => onKey(IsControlReleased, key, callback))
      } catch (error) {
        console.error(error)
      }
    }
  })
  return true
}