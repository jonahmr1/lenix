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
export type Vec4 = [number, number, number, number]
export type Vec3 = [number, number, number]