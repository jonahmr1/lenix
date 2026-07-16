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

/**
 * Three-dimensional coordinates plus heading.
 */
export type Vec4 = [number, number, number, number]

/**
 * Three-dimensional coordinates.
 */
export type Vec3 = [number, number, number]

/**
 * Typed event tuple containing an event id and positional parameters.
 */
export type Event<Id extends string, Params extends unknown[] = never> = [Id, Params]

/**
 * Typed request tuple containing a response type, request id, and object payload.
 */
export type Request<
	Response,
	Id extends string,
	Params extends object = { [key: string]: unknown }
> = Params extends readonly unknown[] ? never
	: [Response, Id, Params]

/**
 * Internal NUI requests used by Lenix helpers. DO NOT USE
 */
export interface _InternalRequests {
	focus: Request<true, '__nuiFocus', {
		keyboard: boolean,
		cursor: boolean
	}>
}
