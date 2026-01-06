const deepMerge = (target: object, source: object) => {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        target[key] = deepMerge({ ...targetValue }, sourceValue)
      } else {
        target[key] = sourceValue
      }
    }
  }

  return target
}

export const tableFiller = (...objects: unknown[]) => {
  objects = objects.filter(obj => obj != null)

  if (objects.length === 0) return {}
  if (objects.length === 1) return { ...objects[0] }

  const result = {}

  for (const obj of objects) {
    deepMerge(result, obj)
  }

  return result
}