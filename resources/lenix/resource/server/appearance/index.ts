import { onClientCallback } from '@overextended/ox_lib/server';
import { oxmysql } from '@overextended/oxmysql';

export async function getOfflineAppearance(charId: number) {
	try {
		const skin = await oxmysql.scalar<string | null>(
			`
			SELECT skin
			FROM playerskins
			INNER JOIN characters ON characters.charId = playerskins.citizenid
			WHERE characters.charId = ?
			LIMIT 1
			`,
			[charId],
		);

		return skin ? JSON.parse(skin) : null;
	} catch(e) {
		console.error(e)
	}
}

onClientCallback('lenix:server:appearance:getappearance', (_playerId, charId: number) => {
	return getOfflineAppearance(charId)
})