import { fatal } from "../../shared"

export default <T extends any[] = any[]>(
  name: string, 
  Function: (...args: T) => void
) => {
  const handler = (event: MessageEvent) => {
    const { __name, params } = event.data
    if (__name === name) {
      try {
        Function(...(params as T))
      } catch (error) {
        fatal(`Error in '${name}' callback: ${error}`)
      }
    }
  }
  
  window.addEventListener('message', handler)

  return () => window.removeEventListener('message', handler)
}