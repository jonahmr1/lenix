/**
 * @module
 * Lenix — a JSR utility package for TypeScript/Deno.
 *
 * @example
 * ```ts
 * import { wait, entries, raise, oneOf } from '@lenix/lenix'
 *
 * await wait(1000)
 * const e = entries({ a: 1, b: 2 })
 * const valid = oneOf('a', ['a', 'b', 'c'])
 * ```
 */

export { wait } from './wait'
export { entries } from './entries'
export { raise } from './raise'
export type { S } from './types'
export { oneOf } from './oneOf'