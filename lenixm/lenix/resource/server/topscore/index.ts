import { onClientCallback } from "@overextended/ox_lib/server"
import type { TopscoreData } from "types/index"

const getData = () => {
	const players = globalThis.exports['qb-core'].GetCoreObject().Functions.GetQBPlayers() as {
		PlayerData?: {
			metadata?: {
				wins?: number;
				deaths?: number;
				kills?: number;
			};
		}
	}[]

	return players.map(player => {
			const metadata = player?.PlayerData?.metadata
			const kills = metadata?.kills ?? 0
			const deaths = metadata?.deaths ?? 0
			return {
				wins: metadata?.wins ?? 0,
				deaths,
				kills,
				kd: deaths > 0 ? kills / deaths : 0
			}
		})
}

onClientCallback('lenix:server:topscore:getData', (): TopscoreData[] => getData())
