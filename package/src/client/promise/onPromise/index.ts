import { fatal } from '../../../shared/console'

const promises: string[] = []

onNet('__tr_promise_self_request_client', (endpoint: string) => {
  emitNet('__tr_promise_self_client_response', source, promises.includes(endpoint))
})

onNet('__tr_promise_on_self_client_lua_backward_compatibility', (endpoint: string) => {
  promises.push(endpoint)
})

export default <T extends (...args: any) => ReturnType<T>>(endpoint: string, Function: T): boolean => {
  if (typeof endpoint !== 'string') return false

  if (promises.includes(endpoint)) {
    fatal(`client promise '${endpoint}' is already defined`)
    return false
  }

  if (typeof Function !== 'function') return false

  promises.push(endpoint)
  emitNet('__tr_promise_on_self_client_ts_backward_compatibility', endpoint)
  
  onNet(`__tr_promise_on:${endpoint}`, (promiseId: number, ...parameters: any) => {
    try {
      const result = Function(...parameters)
      emitNet(`__tr_promise_on:${endpoint}`, promiseId, result)
    } catch (error) {
      emitNet(`__tr_promise_on:${endpoint}`, promiseId)
      console.trace(`client promise '${endpoint}' (server (promise: ${promiseId}) threw error: ${error}`)
    }
  })

  return true
}