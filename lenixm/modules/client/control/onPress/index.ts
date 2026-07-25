import { Bind, isInvalidKey, onKey } from ".."

export default (key: Bind, callback: Function) => {
  if (isInvalidKey(key)) return false

  try {
    setTick(() => onKey(IsControlJustPressed, key, callback))
  } catch (error) {
    console.error(error)
  }
  return true
}