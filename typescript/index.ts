/**
 * @module
 *
 * Lenix provides small TypeScript utilities and reusable React documentation
 * components.
 *
 * @example
 * ```ts
 * import { entries, wait } from '@lenix/lenix'
 *
 * const e = entries({ a: 1, b: 2 })
 * await wait(1000)
 * ```
 */

export * from './wait/index.ts'
export * from './entries/index.ts'
export * from './raise/index.ts'
export * from './storage/index.ts'
export * from './types/index.ts'
export * from './oneOf/index.ts'
export * from './random/index.ts'
