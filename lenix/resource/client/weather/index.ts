import { inputDialog } from "@overextended/ox_lib/client"
import { client } from "lenix/client"
import type { PlayerStorage, SyncConfig as ISyncConfig } from "types/index"

export const SyncConfig: ISyncConfig[] = [
	"server",
	"custom",
	"irl",
] as const

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

const set = {
	server: (() => {
		function server(weatherType: string, weatherFreezed: boolean): void
		function server(timeStamp: number, timeFreezed: boolean): void
		function server(syncType: string | number, syncFreezed: boolean) {
			if (typeof syncType === 'string') {
				// get server weather then set follow
				// freeze if needed
				return
			}
			// get server time and set based on that
			// freeze if needed
		}
		return server
	})(),
	custom: (() => {
		function server(weatherType: string, weatherFreezed: boolean): void
		function server(timeStamp: number, timeFreezed: boolean): void
		function server(syncType: string | number, syncFreezed: boolean) {
			if (typeof syncType === 'string') {
				// set based on type
				// freeze if needed
				return
			}
			// set based on value
			// freeze if needed
		}
		return server
	})(),
	irl: (timeStamp: number, timeFreezed: boolean) => {
		// set based on irl
		// freeze if needed
	}
}

const openMenu = async () => {
	const currentGameWeather = weatherTypes.find(weatherType => GetHashKey(weatherType) === GetPrevWeatherTypeHashName())
	if (!currentGameWeather) throw new Error('Failed to get current weather type')

	const weatherSyncConfig = client.player.storage.get<PlayerStorage, 'weatherSync'>('weatherSync', 'server')
	const weatherFreezed = client.player.storage.get<PlayerStorage, 'weatherFreeze'>('weatherFreeze', 'false')
	const timeSyncConfig = client.player.storage.get<PlayerStorage, 'timeSync'>('timeSync', 'server')
	const timeFreezed = client.player.storage.get<PlayerStorage, 'timeFreeze'>('timeFreeze', 'false')

	const input = await inputDialog('Weather & Time Settings', [
		{
			type: 'slider',
			label: 'WEATHER SYNC: 1. Server | 2. Custom',
			min: 1,
			max: 2,
			default: SyncConfig.indexOf(weatherSyncConfig) + 1
		},
		{
			type: 'select',
			label: 'Weather',
			default: currentGameWeather,
			options: weatherTypes.map(weatherType => ({
				value: weatherType
			}))
		},
		{
			type: 'checkbox',
			label: 'Freeze Weather',
			checked: weatherFreezed === 'true' ? true : false
		},
		{
			type: 'slider',
			label: 'TIME SYNC: 1. Server | 2. Custom | 3. IRL',
			min: 1,
			max: 3,
			default: SyncConfig.indexOf(timeSyncConfig) + 1
		},
		{
			type: 'slider',
			label: 'Time',
			min: 0,
			max: 23,
			default: GetClockHours()
		},
		{
			type: 'checkbox',
			label: 'Freeze Time',
			checked: timeFreezed === 'true' ? true : false
		},
	], {})
	if (!input) return

	const weatherSyncType = input[0] as number
	const weatherType = input[1] as string
	const newWeatherFreezed = input[2] as boolean

	const timeSyncType = input[3] as number
	const timeStamp = input[4] as number
	const newTimeFreezed = input[5] as boolean

	switch (weatherSyncType) {
		case 1:
			set.server(weatherType, newWeatherFreezed)
		break
		case 2:
			set.custom(weatherType, newWeatherFreezed)
		break

		default: throw new Error(`Invalid weatherType: ${weatherSyncType}`)
	}

	switch (timeSyncType) {
		case 1: 
			set.server(timeStamp, newTimeFreezed)
		break
		case 2: 
			set.custom(timeStamp, newTimeFreezed)
		break
		case 3: 
			set.irl(timeStamp, newTimeFreezed)
		break
	
		default: throw new Error(`Invalid timeType: ${timeSyncType}`)
	}

	// 	const time = new Date(Number(timeStamp))
	// 	NetworkOverrideClockTime(time.getHours(), time.getMinutes(), time.getSeconds())

}

on('lenix:client:weather:open', openMenu)