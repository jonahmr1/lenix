import { JsonValue } from "@lenix/lenix"

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
interface JsonObject {
	[key: string]: JsonValue
}
export type Request<
	Response extends JsonValue,
	Id extends string,
	Params extends JsonObject = JsonObject
> = Params extends readonly unknown[] ? never
	: [Response, Id, Params]

export type NuiFetchGeneric = Request<JsonValue, string, JsonObject>
