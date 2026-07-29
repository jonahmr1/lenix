---@diagnostic disable: duplicate-set-field
---@version 1.3.0

---@param entity integer
---@return number
Fuel.LegacyFuel.GetFuel = {
  label = 'GetFuel',
  args = {
    { name = 'entity' }
  },
  returns = {}
}

---@param entity integer
---@param fuel number
Fuel.LegacyFuel.SetFuel = {
  label = 'SetFuel',
  args = {
    { name = 'entity' },
    { name = 'fuel' }
  }
}