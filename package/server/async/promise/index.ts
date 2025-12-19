import promises from '../../../shared/async'
import { fatal } from '../../console'

export const promise = (endpoint: string, FUNCTION: Function) => {
  if (typeof endpoint !== 'string') return false
  if (typeof FUNCTION !== 'function') return false
  
  if (promises.server.includes(endpoint)) {
    fatal(`server async '${endpoint}' is already defined`)
    return false
  }
  
  promises.server.push(endpoint)
  
  onNet(`__tr_async_define:${endpoint}`, (promiseId: number, ...parameters: any) => {
    const clientSource = source
    const invocation = FUNCTION(clientSource, ...parameters)
    console.log(invocation)
    
    if (invocation) {
      emitNet(`__tr_async_await:${endpoint}`, source, promiseId, invocation)
    } else {
      emitNet(`__tr_async_await:${endpoint}`, source, promiseId)
      console.trace(`server async '${endpoint}' (client ${source}) threw error: ${invocation}`)
    }
  })

  return true
}