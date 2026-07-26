local services<const> = require 'services/index'

lib.onPromise('lenix_criminiltasks:server:receiveItem', function(source)
  return services.receiveItem(source)
end)

local addItem<const> = exports.ox_inventory.AddItem

return {
  addItem = addItem
}