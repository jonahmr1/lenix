---@diagnostic disable: duplicate-set-field
---@version 1.2.3

---@class SetFuelType
---@param entity integer
---@param fuelType string

---@class setFuelType
---@return type function, SetFuelType

Fuel.lc_fuel.GetFuel = {
  label = 'GetFuel',
  args = {
    { name = 'entity' }
  },
  returns = {}
}

---@param entity integer
---@param fuel number
Fuel.lc_fuel.SetFuel = {
  label = 'SetFuel',
  args = {
    { name = 'entity' },
    { name = 'fuel' }
  },
}

---@class getFuel
---@return type function, GetFuel

---@class setFuel
---@field SetFuel function