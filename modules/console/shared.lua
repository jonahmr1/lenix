local enabledTypes<const> = lib.load('config', GetCurrentResourceName()).enabledPrintTypes
lib.console = {}

local function isTypeEnabled(type)
  for _, enabledType in ipairs(enabledTypes) do
    if enabledType == type then
      return true
    end
  end
end

lib.console.fatal = function(message)
  if not isTypeEnabled('fatal') then
    return
  end
  print(("^1[FATAL]: %s ^7"):format(message))
end

lib.console.info = function(message)
  if not isTypeEnabled('info') then
    return
  end
  print(("^5[INFO]: %s ^7"):format(message))
end

lib.console.trace = function(message)
  if not isTypeEnabled('trace') then
    return
  end
  print(("^6[TRACE]: %s ^7"):format(message))
end

--[[ Backward compatibility (temporary) ]]

lib.print = {}

lib.print.err = function(message)
  error(message)
end

lib.print.error = function(message)
  error(message)
end

lib.print.warn = function(message)
  warn(message)
end

lib.print.warning = function(message)
  warn(message)
end

lib.print.info = function(message)
  lib.console.info(message)
end

lib.print.debug = function(message)
  lib.console.trace(message)
end

lib.print.success = function(message)
  if not isTypeEnabled('success') then
    return
  end
  print(("^2[SUCCESS]: %s ^7"):format(message))
end

lib.print.log = function(message)
  lib.console.info(message)
end