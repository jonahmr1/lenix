function lib.filter(string, ...)
    assert(type(string) == 'string', ('bad argument #1 (string expected, got %s)'):format(type(string)))

    local result = string
    local filters = {...}

    for _, filter in ipairs(filters) do
        if type(filter) == 'string' then
            result = result:gsub(filter, '')
        elseif type(filter) == 'table' then
            local pattern = filter[1]
            local targetIndex = filter[2]
            local count = 0

            result = result:gsub(pattern, function(match)
                count = count + 1
                if count == targetIndex then
                    return ''
                end
                return match
            end)
        end
    end

    return result
end