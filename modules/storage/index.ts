export const getStorage = <T extends string>(key: T) => localStorage.getItem(key)
export const destroyStorage = <T extends string>(key: T) => localStorage.removeItem(key)
export const setStorage = <T extends string>(key: T, value: string) => localStorage.setItem(key, value)
