import { assert } from "../../shared"

export default async (hash: number, timeout = 10000): Promise<boolean> => {
  assert(typeof hash === 'number', `expected a number at #1, got ${typeof hash}`)

  RequestModel(hash)
  const currentMilliseconds = GetGameTimer()
  while (!HasModelLoaded(hash)) {
    if (GetGameTimer() - currentMilliseconds >= timeout) return false
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  return true
}