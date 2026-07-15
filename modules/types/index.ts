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

export type Event<Id extends string, Params extends unknown[] = never> = [Id, Params]

export type Request<Response, Id extends string, Params extends object = {}> =
	Params extends readonly unknown[]
	? never
	: [Response, Id, Params];

declare function GetParentResourceName(): string

export interface _InternalRequests {
	focus: Request<true, '__nuiFocus', {
		keyboard: boolean
		cursor: boolean
	}>
}