/**
 * @module
 * Lenix — a JSR utility package for TypeScript/Deno.
 *
 * @example
 * ```ts
 * import { wait } from '@lenix/lenix'
 *
 * await wait(1000)
 * ```
 * ```ts
 * import { entries } from '@lenix/lenix'
 *
 * const e = entries({ a: 1, b: 2 })
 * ```
 * ```ts
 * import { oneOf } from '@lenix/lenix'
 *
 * const valid = oneOf('a', ['a', 'b', 'c'])
 * ```
 * ```ts
 * import { raise } from '@lenix/lenix'
 *
 * const retVal = maybeNull ?? raise('Error occurred')
 * ```
 */

export { wait } from './wait'
export { entries } from './entries'
export { raise } from './raise'
export type { S } from './types'
export { oneOf } from './oneOf'