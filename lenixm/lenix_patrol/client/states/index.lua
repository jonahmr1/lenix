local isUiOpen = false
local inVehicle = false
local vehicle = 0

local getState = {
  remoteBusy = false,
  vehicleBusy = false,
  vehicleHandle = 0,
}

local setState<const> = {
  remoteBusy = function(state) getState.remoteBusy = state end,
  vehicleBusy = function(state) getState.vehicleBusy = state end,
  vehicleHandle = function(handle) getState.vehicleHandle = handle end,
}

return {
  isUiOpen = function() return isUiOpen end,
  inVehicle = function() return inVehicle end,
  vehicle = function() return vehicle end,
  getState = getState,
  setState = setState
}

-- WTF BRO, did you see what i see? maaan hemmmm