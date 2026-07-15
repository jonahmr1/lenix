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
export const getStorage = <T extends string>(key: T): string | null => localStorage.getItem(key)

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
export const setStorage = <T extends string>(key: T, value: string): void => {
	localStorage.setItem(key, value)
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
export const destroyStorage = <T extends string>(key: T): void => {
	localStorage.removeItem(key)
}
