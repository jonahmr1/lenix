---@diagnostic disable: duplicate-set-field
---@version 2.0.0

--- @param items string|table - The item(s) to check for. Can be a table of items or a single item as a string.
--- @param amount number [optional] - The minimum amount required for each item. If not provided, any amount greater than 0 will be considered.
--- @return boolean - Returns true if the player has the item(s) with the specified amount, false otherwise.
Inventory['qb-inventory'].HasItem = {
  label = 'HasItem',
  args = {
    { name = 'items' },
    { name = 'amount' }
  },
  returns = {}
}