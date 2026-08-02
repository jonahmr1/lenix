import { onClientCallback } from "@overextended/ox_lib/server"
import { oxmysql } from "@overextended/oxmysql"
import type { TopscoreContextData } from "types/index"

const getData = async (): Promise<TopscoreContextData> => {
	const players = await oxmysql.query<{
		metadata: {
			wins: string
			deaths: string
			kills: string
			serverid: string
		}[]
	}>('SELECT metadata FROM players')

	const emptyScore = {
    wins: 0,
    deaths: 0,
    kills: 0,
    kd: 0,
  };

  const emptyPlayer = {
    stats: emptyScore,
    id: '0',
    name: '',
    avatar: '',
  };

  const [first = emptyPlayer, second = emptyPlayer, third = emptyPlayer] = players.metadata
    .map(metadata => {
      const kills = Number(metadata.kills);
      const deaths = Number(metadata.deaths);

      return {
        stats: {
          wins: Number(metadata.wins),
          deaths,
          kills,
          kd: deaths > 0 ? kills / deaths : 0,
        },
        id: metadata.serverid ?? 'Unknown',
        name: 'Lenix',
        avatar: metadata?.serverid === '0' ? 'https://i.postimg.cc/mD4GYTDn/IMG-9773.jpg' : metadata?.serverid === '105' ? 'https://i.postimg.cc/8ktVvQVL/lqtt-shasht-2026-08-02-210233.png' : 'https://i.postimg.cc/JnxSjJS1/lqtt-shasht-2026-08-02-210330.png',
      };
    })
    .sort((a, b) => b.stats.kills - a.stats.kills);

  return {
    1: first,
    2: second,
    3: third,
  };
}

onClientCallback('lenix:server:topscore:getData', async () => {
	return await getData()
})
