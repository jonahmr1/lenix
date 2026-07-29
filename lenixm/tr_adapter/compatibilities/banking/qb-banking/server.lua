---@diagnostic disable: duplicate-set-field

Banking['qb-banking'].CreatePlayerAccount = {
  label = 'CreatePlayerAccount',
  args = {
    { name = 'playerId' },
    { name = 'accountName' },
    { name = 'accountBalance' },
    { name = 'accountUsers' }
  },
  returns = {}
}

Banking['qb-banking'].CreateJobAccount = {
  label = 'CreateJobAccount',
  args = {
    { name = 'accountName' },
    { name = 'accountBalance' }
  },
  returns = {}
}

Banking['qb-banking'].CreateGangAccount = {
  label = 'CreateGangAccount',
  args = {
    { name = 'accountName' },
    { name = 'accountBalance' }
  },
  returns = {}
}

Banking['qb-banking'].CreateBankStatement = {
  label = 'CreateBankStatement',
  args = {
    { name = 'playerId' },
    { name = 'account' },
    { name = 'amount' },
    { name = 'reason' },
    { name = 'statementType' },
    { name = 'accountType' }
  },
  returns = {}
}

Banking['qb-banking'].AddMoney = {
  label = 'AddMoney',
  args = {
    { name = 'accountName' },
    { name = 'amount' },
    { name = 'reason' }
  },
  returns = {}
}

Banking['qb-banking'].AddGangMoney = {
  label = 'AddGangMoney',
  args = {
    { name = 'accountName' },
    { name = 'amount' },
    { name = 'reason' }
  },
  returns = {}
}

Banking['qb-banking'].RemoveMoney = {
  label = 'RemoveMoney',
  args = {
    { name = 'accountName' },
    { name = 'amount' },
    { name = 'reason' }
  },
  returns = {}
}

Banking['qb-banking'].RemoveGangMoney = {
  label = 'RemoveGangMoney',
  args = {
    { name = 'accountName' },
    { name = 'amount' },
    { name = 'reason' }
  },
  returns = {}
}

Banking['qb-banking'].GetAccount = {
  label = 'GetAccount',
  args = {},
  returns = {}
}

Banking['qb-banking'].GetGangAccount = {
  label = 'GetGangAccount',
  args = {
    { name = 'accountName' }
  },
  returns = {}
}

Banking['qb-banking'].GetAccountBalance = {
  label = 'GetAccountBalance',
  args = {
    { name = 'accountName' }
  },
  returns = {}
}