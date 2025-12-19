---@deprecated Unevolved yet

local Switch = {}
Switch.__index = Switch

function Switch:case(val, result)
  if not self.matched and self.value == val then
    self.matched = true
    if type(result) == "function" then
      self.result = result()
    else
      self.result = result
    end
  end
  return self
end

function Switch:fallback(result)
  if not self.matched then
    if type(result) == "function" then
      self.result = result()
    else
      self.result = result
    end
  end
  return self.result
end

function lib.switch(value)
  return setmetatable({
    value = value,
    matched = false,
    result = nil
  }, Switch)
end