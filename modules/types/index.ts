/**
 * The `useState` setter hook type.
 * @template T - The type of the state.
 * @example
 * S<number | string>
 */
export type S<T> = Dispatch<SetStateAction<T>>
