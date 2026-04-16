local netIdsRequested = {}
local playerJob = {}

local getState<const> = {
  netIdsRequested = netIdsRequested,
  playerJob = playerJob
}

local setState<const> = {
  netIdsRequested = function(state) netIdsRequested = state end,
  playerJob = function(state) playerJob = state end
}

return {
  getState = getState,
  setState = setState
}