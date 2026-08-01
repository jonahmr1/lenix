import { onClientCallback } from "@overextended/ox_lib/server"
import type { TopscoreContextData } from "types/index"

const getData = (): TopscoreContextData => {
	const players = globalThis.exports['qb-core'].GetCoreObject().Functions.GetQBPlayers() as {
		PlayerData?: {
			metadata?: {
				wins?: number;
				deaths?: number;
				kills?: number;
			};
		}
	}[]

	const emptyScore = {
    wins: 0,
    deaths: 0,
    kills: 0,
    kd: 0,
  };

  const emptyPlayer = {
    stats: emptyScore,
    id: 0,
    name: '',
    avatar: '',
  };

  const [first = emptyPlayer, second = emptyPlayer, third = emptyPlayer] = players
    .map(player => {
      const metadata = player?.PlayerData?.metadata;
      const kills = metadata?.kills ?? 0;
      const deaths = metadata?.deaths ?? 0;

      return {
        stats: {
          wins: metadata?.wins ?? 0,
          deaths,
          kills,
          kd: deaths > 0 ? kills / deaths : 0,
        },
        id: player.id,
        name: player.name,
        avatar: player.avatar,
      };
    })
    .sort((a, b) => b.stats.kills - a.stats.kills);

  return {
    1: first,
    2: second,
    3: third,
  };
}

onClientCallback('lenix:server:topscore:getData', getData)
