---@diagnostic disable: duplicate-set-field
---@version 1.0.2

---@class GetFuel
---@param entity integer
---@return type number
Fuel.GetFuel = function(entity)
  return exports['ps-fuel']:GetFuel(entity)
end

---@class SetFuel
---@param entity integer
---@param fuel number
Fuel.SetFuel = function(entity, fuel)
  exports['ps-fuel']:SetFuel(entity, fuel)
end