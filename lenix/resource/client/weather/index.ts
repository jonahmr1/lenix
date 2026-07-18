import { inputDialog } from "@overextended/ox_lib/client"
import { client } from "lenix/client"
import type { PlayerStorage } from "types/index"

export const WeatherConfig: readonly PlayerStorage['weatherSync'][] = [
	"irl",
	"custom",
	"disabled",
]


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
	const currentWeather = weatherTypes.find(weatherType => GetHashKey(weatherType) === GetPrevWeatherTypeHashName())
	if (!currentWeather) throw new Error('Failed to get current weather type')
		
	const currentWeatherSyncType = client.player.storage.get<PlayerStorage, 'weatherSync'>('weatherSync', WeatherConfig[0])

	const input = await inputDialog('Weather & Time Settings', [
		{
			type: 'slider',
			label: 'WeatherSync: 1. In real life | 2. Custom | 3. disable',
			max: 3,
			default: WeatherConfig.indexOf(currentWeatherSyncType) + 1
		},
		{
			type: 'time',
			label: 'Time',
		},
		{
			type: 'select',
			label: 'Weather',
			default: currentWeather,
			options: weatherTypes.map(weatherType => ({
				value: weatherType
			}))
		},
	], {})
	if (!input) return

	const weatherSyncType = input[0]
	const timeStamp = input[1]
	const weatherType = input[2]

	if (timeStamp) {
		const time = new Date(Number(timeStamp))
		NetworkOverrideClockTime(time.getHours(), time.getMinutes(), time.getSeconds())
	}

	if (weatherType && weatherType !== currentWeather && currentWeatherSyncType) {
		SetWeatherTypeOvertimePersist(weatherType.toString(), 20.0)
	}
}

on('lenix:client:weather:open', openMenu)
setImmediate(() => {
	const weatherSyncType = client.player.storage.get<PlayerStorage, 'weatherSync'>('weatherSync')
	client.player.storage.set<PlayerStorage>('weatherSync')
})