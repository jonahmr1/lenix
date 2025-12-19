lib.async = {}
DefinedAsyncs = {}
DefinedAsyncs.client = {}
DefinedAsyncs.server = {}

---@deprecated
if IsDuplicityVersion() then
  lib.callback = {}
  ---@diagnostic disable: duplicate-set-field
  function lib.callback.register(name, func)
    lib.console.fatal(("Callbacks are deprecated, Async expected at '%s'"):format(GetInvokingResource()))
    if type(func) == 'table' then
      lib.console.fatal(("Callbacks from JavaScript are no longer supported, please visit our docs"):format(name))
      return false
    end
    return lib.async.define(name, func)
  end

  function lib.callback.await(debug, name, timeout, source, ...)
    lib.console.fatal(("Callbacks are deprecated, Async expected at '%s'"):format(GetInvokingResource()))
    if type(debug) ~= 'boolean' then
      return lib.callback.await(false, debug, name, timeout, source, ...)
    end
    return lib.async.await({ timeout, debug }, name, source)
  end
else
  lib.callback = {}
  function lib.callback.register(name, func)
    lib.console.fatal(("Callbacks are deprecated, Async expected at '%s'"):format(GetInvokingResource()))
    if type(func) == 'table' then
      lib.console.fatal(("Callbacks from JavaScript are no longer supported, please visit our docs"):format(name))
      return false
    end
    return lib.async.define(name, func)
  end

  function lib.callback.await(debug, name, timeout, ...)
    lib.console.fatal(("Callbacks are deprecated, Async expected at '%s'"):format(GetInvokingResource()))
    if type(debug) ~= 'boolean' then
      return lib.callback.await(false, debug, name, timeout, ...)
    end

    if type(timeout) ~= 'number' then
      return lib.callback.await(debug, name, config.awaitLimit, ...)
    end
    return lib.async.await({ timeout, debug }, name)
  end
end