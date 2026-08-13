type DataValue = unknown

export const removeUndefinedFields = <T extends DataValue>(value: T): T => {
  if (Array.isArray(value)) {
    return value.filter((item) => item !== undefined).map((item) => removeUndefinedFields(item)) as T
  }

  if (!value || typeof value !== 'object') return value

  return Object.entries(value as Record<string, DataValue>).reduce(
    (result, [key, item]) => {
      if (item === undefined) return result
      result[key] = removeUndefinedFields(item)
      return result
    },
    {} as Record<string, DataValue>,
  ) as T
}
