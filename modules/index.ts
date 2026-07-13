/**
 * @module
 * Lenix: a JSR utility package for TypeScript/Deno.
 *
 * @example
 * ```ts
 * import { entries } from '@lenix/lenix'
 *
 * const e = entries({ a: 1, b: 2 })
 * ```
 */

export { wait } from './wait/index.ts'
export { entries } from './entries/index.ts'
export { raise } from './raise/index.ts'
export type { S } from './types/index.ts'
export { oneOf } from './oneOf/index.ts'
export { Code } from './components/code.tsx'
export { H1 } from './components/h1.tsx'
export { H2 } from './components/h2.tsx'
export { H3 } from './components/h3.tsx'
export { Large } from './components/large.tsx'
export { Lead } from './components/lead.tsx'
export { Muted } from './components/muted.tsx'
export { P } from './components/p.tsx'
export { Required } from './components/required.tsx'
export { Ul } from './components/ul.tsx'
