import { inputDialog } from "@overextended/ox_lib/client"

const weatherTypes = [
	'CLEAR',
	'EXTRASUNNY',
	'CLOUDS',
	'OVERCAST',
	'RAIN',
	'CLEARING',
	'THUNDER',
	'SMOG',
	'FOGGY',
	'XMAS',
	'SNOW',
	'SNOWLIGHT',
	'BLIZZARD',
	'HALLOWEEN',
	'NEUTRAL',
	'RAIN_HALLOWEEN',
	'SNOW_HALLOWEEN',
]

const openMenu = async () => {
	const input = await inputDialog('Weather & Time Settings', [
		{
			type: 'time',
			label: 'Time',
		},
		{
			type: 'select',
			label: 'Weather',
			options: weatherTypes.map(weatherType => ({
				value: weatherType
			}))
		}
	], {})
	if (!input) return

	// SetWeatherTypeNow()
	// NetworkOverrideClockTime()
}

const syncTime = () => {
	const now = new Date()
	NetworkOverrideClockTime(now.getHours(), now.getMinutes(), now.getSeconds())
}

syncTime()
setInterval(syncTime, 60_000)

on('lenix:client:weather:open', openMenu)