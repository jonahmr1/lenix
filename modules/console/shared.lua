local enabledTypes<const> = config.enabledPrintTypes
lib.console = {}

local function isTypeEnabled(type)
  for _, enabledType in ipairs(enabledTypes) do
    if enabledType == type then
      return true
    end
  end
end

lib.console.fatal = function(...)
  if not isTypeEnabled('fatal') then
    return
  end
  print(("^1[FATAL]: %s ^7"):format(...))
end

lib.console.info = function(...)
  if not isTypeEnabled('info') then
    return
  end
  print(("^5[INFO]: %s ^7"):format(...))
end

lib.console.trace = function(...)
  if not isTypeEnabled('trace') then
    return
  end
  print(("^6[TRACE]: %s ^7"):format(...))
end

---@deprecated
lib.print = {}

lib.print.err = function(...)
  error(...)
end

lib.print.error = function(...)
  error(...)
end

lib.print.warn = function(...)
  warn(...)
end

lib.print.warning = function(...)
  warn(...)
end

lib.print.info = function(...)
  lib.console.info(...)
end

lib.print.debug = function(...)
  lib.console.trace(...)
end

lib.print.success = function(...)
  if not isTypeEnabled('success') then
    return
  end
  print(("^2[SUCCESS]: %s ^7"):format(...))
end

lib.print.log = function(...)
  lib.console.info(...)
end