import { onClientCallback } from "@overextended/ox_lib/server"
import type { TopscoreData } from "types/index"

const getData = () => {
	const players = globalThis.exports['qb-core'].GetCoreObject().Functions.GetQBPlayers()

	return players.map(player => {
		console.debug(player)
		const { PlayerData: { metadata } = player
		return {
			wins: metadata?.wins ?? 0,
			deaths: metadata?.deaths ?? 0,
			kills: metadata?.kills ?? 0,
			kd: metadata?.kills ?? 0 / metadata?.losses ?? 0
		}
	})
}

let players = getData()

setInterval(() => {
	players = getData()
}, 60_000)

onClientCallback('lenix:server:topscore:getData', (): TopscoreData => players)
