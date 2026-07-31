import { onClientCallback } from "@overextended/ox_lib/server"

const getData = () => {
	const players = globalThis.exports['qb-core'].GetCoreObject().Functions.GetQBPlayers()

	return players.map(player => {
		console.debug(player)
		const { PlayerData: { metadata: { wins, deaths, losses, kills } } } = player
		return {
			wins, deaths, kills, kd: kills / losses
		}
	})
}

let players = getData()

setInterval(() => {
	// players = getData()
}, 60_000)

onClientCallback('lenix:server:topscore:getData', () => players)
