---@diagnostic disable: duplicate-set-field
---@version 3.31.4

Menu.ox_lib.Open = {
  label = 'showContext',
  args = {
    { name = 'id' },
  }
}

Menu.ox_lib.RegisterContext = {
  label = 'registerContext',
  args = {
    { name = 'context' },
  }
}

Menu.ox_lib.GetOpenContextMenu = {
  label = 'getOpenContextMenu',
}

Menu.ox_lib.Close = {
  label = 'hideContext',
  args = {
    { name = 'onExit' },
  }
}