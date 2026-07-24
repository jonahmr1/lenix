---@diagnostic disable: duplicate-set-field
---@version 1.2.0

Menu['qb-menu'].Open = {
  label = 'openMenu',
  args = {
    { name = 'data' },
    { name = 'sort' },
    { name = 'skipFirst' },
  }
}

Menu['qb-menu'].ShowHeader = {
  label = 'showHeader',
  args = {
    { name = 'data' },
  }
}

Menu['qb-menu'].Close = {
  label = 'closeMenu',
}