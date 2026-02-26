/**
 * Delay execution for a given duration.
 * @param ms - Duration in milliseconds (1000ms = 1 second)
 */
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))