function InitENV(Category, handler, functionName, param, called)
  local map = MapArguments(param, Category[called][functionName].args, Category[handler][functionName].args)
  local export = CallExport(Category, handler, functionName, map)
  local convertion = BuildConversionTable(export, Category)
  return convertion
end