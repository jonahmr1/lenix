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
export * from './components/code.tsx'
export * from './components/h1.tsx'
export * from './components/h2.tsx'
export * from './components/h3.tsx'
export * from './components/large.tsx'
export * from './components/lead.tsx'
export * from './components/muted.tsx'
export * from './components/p.tsx'
export * from './components/required.tsx'
export * from './components/ul.tsx'
