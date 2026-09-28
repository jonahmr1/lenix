/**
 * @module
 *
 * Web storage utilities.
 */

/**
 * Gets a value from local storage.
 *
 * @param key - Storage key to read.
 * @returns The stored value, or `null` when the key does not exist.
 *
 * @example
 * ```ts
 * import { getStorage } from '@lenix/lenix'
 *
 * const theme = getStorage('theme')
 * ```
 */
const get = <
	T extends {
		[P in keyof T]: string | number | boolean | bigint | null | undefined
	},
	K extends Extract<keyof T, string>
>(key: K): `${T[K]}` | null => localStorage.getItem(key) as `${T[K]}` | null

/**
 * Stores a value in local storage.
 *
 * @param key - Storage key to write.
 * @param value - Value to store.
 *
 * @example
 * ```ts
 * import { setStorage } from '@lenix/lenix'
 *
 * setStorage('theme', 'dark')
 * ```
 */
export const set = <
	T extends object,
	K extends Extract<keyof T, string>
>(
	key: K,
	value: T[K]
): void => {
	localStorage.setItem(key, JSON.stringify(value))
}

/**
 * Removes a value from local storage.
 *
 * @param key - Storage key to remove.
 *
 * @example
 * ```ts
 * import { destroyStorage } from '@lenix/lenix'
 *
 * destroyStorage('theme')
 * ```
 */
export const destroy = <T extends object>(key: Extract<keyof T, string>): void => {
	localStorage.removeItem(key)
}

export const storage: {
	get: typeof get,
	set: typeof set,
	destroy: typeof destroy
} = {
	get,
	set,
	destroy
}
