import { inputDialog, notify } from "@overextended/ox_lib/client"
import { client } from "lenix/client"
import type { PlayerStorage, SyncConfig as ISyncConfig } from "types/index"

export const SyncConfig: ISyncConfig[] = [
	"server",
	"custom",
	"irl",
] as const

const weatherTypes: PlayerStorage['weatherType'][] = [
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

let timeMode: ISyncConfig = client.player.storage.get<PlayerStorage, 'timeSync'>('timeSync', 'server')

const setTime = () => {
	if (timeMode === 'custom') {
		const time = client.player.storage.get<PlayerStorage, 'timeValue'>('timeValue')
		NetworkOverrideClockTime(Number(time), 0, 0)
		return
	}
	if (timeMode === 'irl') {
		const now = new Date()
		NetworkOverrideClockTime(now.getHours(), now.getMinutes(), 0)
	}
}

const setWeather = (syncType?: string) => {
	const weatherConfig = client.player.storage.get<PlayerStorage, 'weatherSync'>('weatherSync')
	if (weatherConfig !== 'custom') return

	SetWeatherTypeNowPersist(syncType ?? client.player.storage.get<PlayerStorage, 'weatherType'>('weatherType', 'CLEAR'))
}

const set = {
	server: (type: 'weather' | 'time', syncFreezed: boolean) => {
		notify({
			title: 'This feature is not available yet!',
			type: 'warning'
		})
		if (type === 'time') {
			timeMode = 'server'
			client.player.storage.set<PlayerStorage>('timeSync', 'server')
			client.player.storage.delete<PlayerStorage>('timeValue')
			return
		}
		client.player.storage.set<PlayerStorage>('weatherSync', 'server')
		client.player.storage.delete<PlayerStorage>('weatherType')
	},
	custom: (() => {
		function custom(weatherType: PlayerStorage['weatherType'], weatherFreezed: boolean): void
		function custom(hour: number, timeFreezed: boolean): void
		function custom(syncValue: PlayerStorage['weatherType'] | number, syncFreezed: boolean) {
			if (typeof syncValue === 'string') {
				client.player.storage.set<PlayerStorage>('weatherSync', 'custom')
				client.player.storage.set<PlayerStorage>('weatherType', syncValue)
				setWeather(syncValue)
				return
			}

			timeMode = 'custom'
			NetworkOverrideClockTime(syncValue, 0, 0)
			client.player.storage.set<PlayerStorage>('timeSync', 'custom')
			client.player.storage.set<PlayerStorage>('timeValue', syncValue.toString())
		}
		return custom
	})(),
	irl: (timeFreezed: boolean) => {
		timeMode = 'irl'

		setTime()
		client.player.storage.set<PlayerStorage>('timeSync', 'irl')
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
	const weatherType = input[1] as PlayerStorage['weatherType']
	const newWeatherFreezed = input[2] as boolean

	const timeSyncType = input[3] as number
	const hour = input[4] as number
	const newTimeFreezed = input[5] as boolean

	client.player.storage.set<PlayerStorage>(
			'weatherFreeze',
			newWeatherFreezed.toString() as 'true' | 'false'
		)

	client.player.storage.set<PlayerStorage>(
			'timeFreeze',
			newTimeFreezed.toString() as 'true' | 'false'
	)

	switch (weatherSyncType) {
		case 1:
			set.server('weather', newWeatherFreezed)
		break
		case 2:
			set.custom(weatherType, newWeatherFreezed)
		break

		default: throw new Error(`Invalid weatherType: ${weatherSyncType}`)
	}

	switch (timeSyncType) {
		case 1: 
			set.server('time', newTimeFreezed)
		break
		case 2: 
			set.custom(hour, newTimeFreezed)
		break
		case 3: 
			set.irl(newTimeFreezed)
		break
	
		default: throw new Error(`Invalid timeType: ${timeSyncType}`)
	}
}

setInterval(() => {
	setTime()
}, 60_000)

setImmediate(() => {
	setWeather()
	setTime()
})

on('lenix:client:weather:open', openMenu)