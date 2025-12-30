import { Bind, isInvalidKey, onKey } from ".."

export default (key: Bind, callback: Function) => {
  if (isInvalidKey(key)) return false

  setTick(() => onKey(IsControlJustPressed, key, callback))
  return true
}