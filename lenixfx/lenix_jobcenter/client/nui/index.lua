local modules <const> = require 'client/modules/index'
local constants <const> = require 'shared/constants/index'

lib.onNuiCallback('closeUI', function(_, cb)
	modules.closeJobCenter()
	cb(true)
end)

lib.onNuiCallback('takeJob', function(data, cb)
	if not constants.jobsConfig[data.jobName] then
		cb(false)
		return
	end

	TriggerServerEvent('lenix_jobcenter:takeJob', data.jobName, data.jobLabel)
	modules.closeJobCenter()
	cb(true)
end)

lib.onNuiCallback('markLocation', function(data, cb)
	local job = constants.jobsConfig[data.jobName]
	if job and job.location then
		SetNewWaypoint(job.location.x, job.location.y)
		modules.showNotification(string.format("Location marked for %s", job.name))
		cb(true)
	else
		cb(false)
	end
end)
