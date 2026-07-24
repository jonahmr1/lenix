import { trace } from '../../../shared/console'

const pendingPromises: { [key: number]: { resolve: (value: any) => void } } = {}
const patienceLimit = 5000
const promises: string[] = []
let promiseId = 0

export const triggerPromise = async <T = unknown>(
  options: [number, boolean] | number | boolean | string,
  endpoint: string | number,
  source?: number,
  ...parameters: any[]
): Promise<T | []> => {
  if (typeof options === 'string') {
    return triggerPromise([patienceLimit, false], options, endpoint as number, ...parameters)
  }
  if (typeof options === 'number') {
    return triggerPromise([options, false], endpoint, source, ...parameters)
  }
  if (typeof options === 'boolean') {
    return triggerPromise([patienceLimit, options], endpoint, source, ...parameters)
  }

  const timeout = options?.[0] ?? patienceLimit
  const debug = options?.[1] ?? false
  
  const promise = () => {
    return new Promise(resolve => {
      promiseId = promiseId + 1
      const currentPromiseId = promiseId
      pendingPromises[currentPromiseId] = { resolve }
      const responseEvent = `__tr_promise_trigger:${endpoint}`

      if (!promises.includes(endpoint as string)) {
        promises.push(endpoint as string)
        onNet(responseEvent, (selfpromiseId: number, response: any) => {
          if (pendingPromises[selfpromiseId]) {
            pendingPromises[selfpromiseId].resolve({ success: true, returned: response })
            delete pendingPromises[selfpromiseId]
          }
        })
      }

      emitNet(`__tr_promise_on:${endpoint}`, source, currentPromiseId, ...parameters)

      setTimeout(() => {
        if (pendingPromises[currentPromiseId]) {
          pendingPromises[currentPromiseId].resolve({ success: false })
          delete pendingPromises[currentPromiseId]
          /* TODO: Memory leak - if timeout fires before response, the onNet handler stays registered forever. */
        }
      }, timeout)
    })
  }
  
  const response = await promise() as { success: boolean, returned: any }
  if (response.success) {
    if (debug) {
      trace(`client #${source} promise ${endpoint} returned ${Object.keys(response.returned).length} values`)
    }
    return response.returned as T
  } else {
    if (debug) {
      trace(`client #${source} promise ${endpoint} timed out after ${timeout}ms`)
    }
  }
  return []
}