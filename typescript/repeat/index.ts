/**
 * Polls `check` on an interval until a condition is met, then resolves with the checked value.
 *
 * - With no condition, resolves on the first truthy value.
 * @param read Function called on every tick to get the current value.
 * @param untilOrEqual Value to match with `===`, or a predicate that decides when to stop.
 */
export const repeat = <T>(
  read: () => T,
  untilOrEqual?: T | ((checked: T) => boolean),
  each?: number
): Promise<T> => new Promise(resolve => {
  const check: (checked: T) => boolean =
    untilOrEqual === undefined ? checked => !!checked
    : typeof untilOrEqual === 'function' ? untilOrEqual as (checked: T) => boolean
    : checked => checked === untilOrEqual

  const interval = setInterval(() => {
    const readValue = read()
    if (!check(readValue)) return

    clearInterval(interval)
    resolve(readValue)
  }, each)
})
