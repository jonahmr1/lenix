exports('open', function(main, options)
  local mappedOptions = {}
  for i = 1, #options do
    table.insert(mappedOptions, {
      title = options[i].title,
      description = options[i].description,
      icon = options[i].icon,
      disabled = options[i].restricted,
      onSelect = options[i].onClick,
    })
  end

  lib.registerContext({
    id = main.id,
    title = main.header,
    options = mappedOptions
  })
  lib.showContext(main.id)
end)

exports('hide', function()
  lib.hideContext()
end)