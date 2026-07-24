local config<const> = require 'shared.constants/index'
local api<const> = require 'api/index'

local function receiveItem(source)
  local roll<const> = math.random(1, 100)
  local cumulative = 0
  local selectedItem, selectedAmount

  for itemName, data in pairs(config.items) do
    cumulative = cumulative + data.percentage
    if roll <= cumulative then
      selectedItem = itemName
      selectedAmount = data.amount or 1
      break
    end
  end

  if not selectedItem then
    return { success = false, error = "No item rolled (percentages misconfigured)" }
  end

  local success, response = api.addItem(source, selectedItem, selectedAmount)

  return { 
    item = selectedItem,
    amount = selectedAmount,
    success = success,
    response = response
  }
end

return {
  receiveItem = receiveItem
}