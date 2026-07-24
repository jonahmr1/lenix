/**
 * @module
 *
 * Shared TypeScript types.
 */

/**
 * React-compatible state setter type.
 *
 * @template T - The type of the state.
 *
 * @example
 * ```ts
 * import type { S } from '@lenix/lenix'
 *
 * S<number | string>
 * ```
 */
export type S<T> = (value: T | ((previous: T) => T)) => void

export type Nestify<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? Nestify<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`
}[keyof T]