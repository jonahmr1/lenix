lib.async = {}
DefinedAsyncs = {}
DefinedAsyncs.client = {}
DefinedAsyncs.server = {}

if IsDuplicityVersion() then
  ---@deprecated
  lib.callback = {}
  ---@diagnostic disable: duplicate-set-field
  function lib.callback.register(name, func)
    lib.console.info(("Callbacks are deprecated, Async expected at '%s'"):format(GetInvokingResource()))
    if type(func) == 'table' then
      lib.console.info(("Callbacks from JavaScript are no longer supported, please visit our docs"):format(name))
      return false
    end
    return lib.async.define(name, func)
  end

  function lib.callback.await(debug, name, timeout, source, ...)
    lib.console.info(("Callbacks are deprecated, Async expected at '%s'"):format(GetInvokingResource()))
    if type(debug) ~= 'boolean' then
      return lib.callback.await(false, debug, name, timeout, source, ...)
    end
    return lib.async.await({ timeout, debug }, name, source)
  end
else
  ---@deprecated
  lib.callback = {}
  function lib.callback.register(name, func)
    lib.console.info(("Callbacks are deprecated, Async expected at '%s'"):format(GetInvokingResource()))
    if type(func) == 'table' then
      lib.console.info(("Callbacks from JavaScript are no longer supported, please visit our docs"):format(name))
      return false
    end
    return lib.async.define(name, func)
  end

  function lib.callback.await(debug, name, timeout, ...)
    lib.console.info(("Callbacks are deprecated, Async expected at '%s'"):format(GetInvokingResource()))
    if type(debug) ~= 'boolean' then
      return lib.callback.await(false, debug, name, timeout, ...)
    end

    if type(timeout) ~= 'number' then
      return lib.callback.await(debug, name, config.awaitLimit, ...)
    end
    return lib.async.await({ timeout, debug }, name)
  end
end