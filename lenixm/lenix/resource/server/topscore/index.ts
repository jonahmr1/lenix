import { checkDependency, onClientCallback } from '@overextended/ox_lib/server'
import { oxmysql } from '@overextended/oxmysql'
import type { TopscoreContextData } from 'types/index'

checkDependency('oxmysql', '2.14.1', true)
checkDependency('ox_lib', '3.39.0', true)

const getData = async (): Promise<TopscoreContextData> => {
	const players = await oxmysql.query<{
		metadata: {
			wins: string
			deaths: string
			kills: string
			serverid: string
		}[]
	}>('SELECT metadata FROM players')

	const playerFb = {
		name: 'unknown',
		avatar: 'https://lenix.dev/icon.png',
		stats: {
			wins: 0,
			deaths: 0,
			kills: 0,
			kd: 0,
		},
	}

	const [first = playerFb, second = playerFb, third = playerFb] = players.metadata
		.map(metadata => {
			const kills = Number(metadata.kills)
			const deaths = Number(metadata.deaths)

			return {
				stats: {
					wins: Number(metadata.wins),
					deaths,
					kills,
					kd: deaths > 0 ? kills / deaths : 0,
				},
				name: playerFb.name,
				avatar: playerFb.avatar
			}
		})
		.sort((a, b) => b.stats.kills - a.stats.kills)

	return {
		1: first,
		2: second,
		3: third,
	}
}

onClientCallback('lenix:server:topscore:getData', getData)
