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

export default <T extends any[] = any[]>(
  name: string, 
  Function: (...args: T) => void
) => {
  callbacks.set(name, Function)
}