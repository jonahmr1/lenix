import { fatal } from '../../../shared/console'

const promises: string[] = []

onNet('__tr_promise_on_self_server_lua_backward_compatibility', (endpoint: string) => {
  promises.push(endpoint)
})

export default <T extends (source: number, ...args: any) => ReturnType<T>>(endpoint: string, Function: T): boolean => {
  if (typeof endpoint !== 'string') return false

  if (promises.includes(endpoint)) {
    fatal(`server promise '${endpoint}' is already defined`)
    return false
  }

  if (typeof Function !== 'function') return false

  promises.push(endpoint)
  emitNet('__tr_promise_on_self_server_ts_backward_compatibility', -1, endpoint)

  onNet(`__tr_promise_on:${endpoint}`, async(promiseId: number, ...parameters: any) => {
    const clientSource = source

    try {
      const result = await Promise.resolve(Function(clientSource, ...parameters))
      emitNet(`__tr_promise_trigger:${endpoint}`, clientSource, promiseId, result)
    } catch (error) {
      console.trace(`server promise '${endpoint}' (client id: ${source}) threw error: ${error}`)
      emitNet(`__tr_promise_trigger:${endpoint}`, clientSource, promiseId)
    }
  })

  return true
}