return {
    removeMoney = function(target, amount)
        exports['Renewed-Banking']:removeAccountMoney(target, amount)
    end,
        
    getAccountBudget = function()
        return exports['Renewed-Banking']:getAccountMoney('police')
    end,
    
    addMoney = function(target, amount)
        exports['Renewed-Banking']:addAccountMoney(target, amount)
    end
}