import type { Dispatch, SetStateAction } from 'npm:@types/react@^19'

/**
 * The `useState` setter hook type.
 * @template T - The type of the state.
 * @example
 * S<number | string>
 */
export type S<T> = Dispatch<SetStateAction<T>>
