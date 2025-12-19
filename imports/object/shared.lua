function lib.isObject(value)
  return type(value) == 'table' and #value == 0
end