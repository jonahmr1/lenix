return {
  removeMoney = function(target, amount, reason)
    exports['Renewed-Banking']:removeAccountMoney(target, amount)
  end,

  getAccountBudget = function()
    return exports['Renewed-Banking']:getAccountMoney('police')
  end,

  addMoney = function(target, amount, reason)
    exports['Renewed-Banking']:addAccountMoney(target, amount)
  end
}