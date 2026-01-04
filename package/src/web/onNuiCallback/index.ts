import { fatal } from "../../shared"

const callbacks = new Map<string, (...args: any[]) => void>()

window.addEventListener('message', (event: MessageEvent) => {
  const { __name, params } = event.data
  const callback = callbacks.get(__name)
  
  if (callback) {
    try {
      callback(...(params || []))
    } catch (error) {
      fatal`Error in '${__name}' callback: ${error}`
    }
  }
})

export default (
  endpoint: string, 
  callback: (...args: any[]) => void
) => {
  callbacks.set(endpoint, callback)
  return true
}