---@diagnostic disable: duplicate-set-field

Management['qb-management'].AddBossMenuItem = {
  label = 'AddBossMenuItem',
  args = {
    { name = 'data' },
    { name = 'id' }
  },
  returns = {}
}

Management['qb-management'].RemoveBossMenuItem = {
  label = 'RemoveBossMenuItem',
  args = {
    { name = 'id' }
  }
}

Management['qb-management'].AddGangMenuItem = {
  label = 'AddGangMenuItem',
  args = {
    { name = 'data' },
    { name = 'id' }
  },
  returns = {}
}

Management['qb-management'].RemoveGangMenuItem = {
  label = 'RemoveGangMenuItem',
  args = {
    { name = 'id' }
  }
}