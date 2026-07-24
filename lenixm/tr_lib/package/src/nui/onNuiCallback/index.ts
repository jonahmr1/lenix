import { fatal } from "../../shared"

const callbacks = new Map<string, (...parameters: any[]) => void>()

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

export default <T extends any[] = any[]>(
  endpoint: string, 
  callback: (...parameters: T) => void
) => {
  callbacks.set(endpoint, callback)
  return true
}