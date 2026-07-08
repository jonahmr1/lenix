const syncTime = () => {
	const now = new Date()
	NetworkOverrideClockTime(now.getHours(), now.getMinutes(), now.getSeconds())
}

syncTime()
setInterval(syncTime, 60_000)
