local modules <const> = require 'client/modules/index'

lib.onNuiCallback('hirePlayer', function(data, cb)
	modules.hirePlayer(data.citizenid, data.rank, data.callsign)
	cb(true)
end)

lib.onNuiCallback('firePlayer', function(data, cb)
	modules.firePlayer(data.citizenid, data.reason)
	cb(true)
end)

lib.onNuiCallback('updateReputation', function(data, cb)
	modules.updateReputation(data.citizenid, data.action, data.points)
	cb(true)
end)

lib.onNuiCallback('transferFunds', function(data, cb)
	modules.transferFunds(data.citizenid, data.type, data.amount)
	cb(true)
end)

lib.onNuiCallback('manageFunds', function(data, cb)
	modules.manageFunds(data.action, data.amount, data.reason)
	cb(true)
end)

lib.onNuiCallback('openStash', function(_, cb)
	modules.openStash()
	cb(true)
end)
