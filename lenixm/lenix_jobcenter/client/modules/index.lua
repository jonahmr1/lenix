local function showNotification(message)
	exports.qbx_core:Notify(message)
end

local function openJobCenter()
	local _, jobsProgress = lib.triggerPromise('lenix_jobcenter:server:getProgress')

	-- Triggering NUI to display the UI
	lib.triggerNuiCallback('openJobCenter', jobsProgress)
	TriggerScreenblurFadeIn(4000.0)
end

local function closeJobCenter()
	lib.triggerNuiCallback('closeJobCenter')
	TriggerScreenblurFadeOut(4000.0)
end

return {
	showNotification = showNotification,
	openJobCenter = openJobCenter,
	closeJobCenter = closeJobCenter
}
