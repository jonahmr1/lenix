/**
 * @module
 * Lenix: a JSR utility package for TypeScript/Deno.
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
export { Code } from './components/code'
export { H1 } from './components/h1.tsx'
export { H2 } from './components/h2.tsx'
export { H3 } from './components/h3.tsx'
export { Large } from './components/large.tsx'
export { Lead } from './components/lead.tsx'
export { Muted } from './components/muted.tsx'
export { P } from './components/p.tsx'
export { Required } from './components/required.tsx'
export { Ul } from './components/ul.tsx'
