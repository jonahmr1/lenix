---@diagnostic disable: duplicate-set-field

Banking['Renewed-Banking'].HandleTransaction = {
  label = 'handleTransaction',
  args = {
    { name = 'account' },
    { name = 'title' },
    { name = 'amount' },
    { name = 'message' },
    { name = 'issuer' },
    { name = 'receiver' },
    { name = 'transType' },
    { name = 'transID' }
  },
  returns = {}
}

Banking['Renewed-Banking'].GetAccountMoney = {
  label = 'getAccountMoney',
  args = {
    { name = 'account' }
  },
  returns = {}
}

Banking['Renewed-Banking'].AddAccountMoney = {
  label = 'addAccountMoney',
  args = {
    { name = 'account' },
    { name = 'amount' }
  },
  returns = {}
}

Banking['Renewed-Banking'].RemoveAccountMoney = {
  label = 'removeAccountMoney',
  args = {
    { name = 'account' },
    { name = 'amount' }
  },
  returns = {}
}

Banking['Renewed-Banking'].ChangeAccountName = {
  label = 'changeAccountName',
  args = {
    { name = 'account' },
    { name = 'newName' },
    { name = 'src' }
  },
  returns = {}
}

Banking['Renewed-Banking'].GetJobAccount = {
  label = 'GetJobAccount',
  args = {
    { name = 'jobName' }
  },
  returns = {}
}

--- @param job table A table containing job account details
--- @param initialBalance number? The starting balance of the account. Default is 0.
--- @return table Returns the account table if found or successfully created.
Banking['Renewed-Banking'].CreateJobAccount = {
  label = 'CreateJobAccount',
  args = {
    { name = 'job' },
    { name = 'initialBalance' }
  },
  returns = {}
}

Banking['Renewed-Banking'].AddAccountMember = {
  label = 'addAccountMember',
  args = {
    { name = 'account' },
    { name = 'member' }
  }
}

Banking['Renewed-Banking'].RemoveAccountMember = {
  label = 'removeAccountMember',
  args = {
    { name = 'account' },
    { name = 'member' }
  }
}

Banking['Renewed-Banking'].GetAccountTransactions = {
  label = 'getAccountTransactions',
  args = {
    { name = 'account' }
  },
  returns = {}
}