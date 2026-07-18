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

	if (input[0]) {
		const time = new Date(Number(input[0]))
		NetworkOverrideClockTime(time.getHours(), time.getMinutes(), time.getSeconds())
	}

	if (input[1]) {
		SetWeatherTypeOvertimePersist(input[1].toString(), 20.0)
	}
}

on('lenix:client:weather:open', openMenu)