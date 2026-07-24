function MapArguments(inputArgs, fromArgsConfig, toArgsConfig)
    local mappedArgs = {}

    local fromLookup = {}
    for i, argConfig in ipairs(fromArgsConfig) do
        fromLookup[argConfig.name] = i
    end

    for i, argConfig in ipairs(toArgsConfig) do
        local argName = argConfig.name
        local defaultValue = argConfig.defaultValue

        if fromLookup[argName] and inputArgs[fromLookup[argName]] ~= nil then
            mappedArgs[i] = inputArgs[fromLookup[argName]]
        elseif defaultValue ~= nil then
            mappedArgs[i] = defaultValue
        end
    end
    return mappedArgs
end