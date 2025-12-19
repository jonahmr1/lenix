import promises from '../../../shared/async'
import { trace, fatal } from '../../console'

const pendingPromises: { [key: number]: { resolve: (value: any) => void } } = {}
const definedAddress: string[] = []
let promiseId = 0
const awaitLimit = 5000

export const listen = async (options: [number, boolean] | number | boolean, endpoint: string, ...parameters: any[]): Promise<any> => {
  if (typeof options === 'string') {
    return listen([awaitLimit, false], options, endpoint, ...parameters)
  }
  if (typeof options === 'number') {
    return listen([options, false], endpoint, ...parameters)
  }
  if (typeof options === 'boolean') {
    return listen([awaitLimit, options], endpoint, ...parameters)
  }
  
  const timeout = options[0] ?? awaitLimit
  const debug = options[1] ?? false
  
  const promise = () => {
    return new Promise(resolve => {
      promiseId = promiseId + 1
      const currentPromiseId = promiseId
      pendingPromises[currentPromiseId] = { resolve }
      const responseEvent = `__tr_async_await:${endpoint}`

      if (!definedAddress.includes(responseEvent)) {
        definedAddress.push(responseEvent)
        onNet(responseEvent, (selfpromiseId: number, response: any) => {
          if (pendingPromises[selfpromiseId]) {
            pendingPromises[selfpromiseId].resolve({ success: true, returned: response })
            delete pendingPromises[selfpromiseId]
          }
        })
      }

      if (!promises.server.includes(endpoint)) {
        fatal(`async ${endpoint} is not defined`)
        return
      }
      
      emitNet(`__tr_async_define:${endpoint}`, currentPromiseId, ...parameters)
      
      setTimeout(() => {
        if (pendingPromises[currentPromiseId]) {
          pendingPromises[currentPromiseId].resolve({ success: false })
          delete pendingPromises[currentPromiseId]
        }
      }, timeout)
    })
  }
  
  const response = await promise() as { success: boolean, returned: any }
  
  if (response.success) {
    if (debug) {
      trace(`server async ${endpoint} returned ${Object.keys(response.returned).length} values`)
    }
    return response.returned
  } else {
    if (debug) {
      trace(`server async ${endpoint} timed out after ${timeout}ms`)
    }
  }
  return null
}