---@diagnostic disable: duplicate-set-field

Management.qbx_management.AddBossMenuItem = {
  label = 'AddBossMenuItem',
  args = {
    { name = 'menuItem' }
  },
  returns = {}
}

Management.qbx_management.AddGangMenuItem = {
  label = 'AddGangMenuItem',
  args = {
    { name = 'menuItem' }
  },
  returns = {}
}

Management.qbx_management.RemoveBossMenuItem = {
  label = 'RemoveBossMenuItem',
  args = {
    { name = 'id' }
  }
}

---@param groupType GroupType
Management.qbx_management.OpenBossMenu = {
  label = 'OpenBossMenu',
  args = {
    { name = 'groupType' }
  }
}