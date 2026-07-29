---@diagnostic disable: duplicate-set-field
---@version 2.1.9

---@class IsHoldingElectricNozzle
---@return type boolean

---@class SetElectricNozzle
---@param state string

---@class FetchStationInfo
---@param info string
---@return type integer

---@class UpdateStationInfo
---@param info string

---@param entity integer
---@return number
Fuel['cdn-fuel'].GetFuel = {
  label = 'GetFuel',
  args = {
    { name = 'entity' }
  },
  returns = { 'number' }
}

---@param entity integer
---@param fuel number
Fuel['cdn-fuel'].SetFuel = {
  label = 'SetFuel',
  args = {
    { name = 'entity' },
    { name = 'fuel' }
  },
}