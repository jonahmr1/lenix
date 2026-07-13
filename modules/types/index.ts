/**
 * @module
 * The `useState` setter hook type.
 * @template T - The type of the state.
 * @example
 * S<number | string>
 */
export type S<T> = (value: T | ((previous: T) => T)) => void
