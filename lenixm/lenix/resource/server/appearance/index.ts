import { addCommand, checkDependency, onClientCallback } from '@overextended/ox_lib/server'
import { oxmysql } from '@overextended/oxmysql'

checkDependency('illenium-appearance', '5.7.0', true)
checkDependency('ox_lib', '3.39.0', true)

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
		)

		return skin ? JSON.parse(skin) : null
	} catch (e) {
		console.error(e)
	}
}

onClientCallback('lenix:server:appearance:getappearance', (_playerId, charId: number) => {
	return getOfflineAppearance(charId)
})

addCommand(
	'giveclothes',
	async (playerId, args) => {
		emitNet('illenium-appearance:client:openClothingShop', args?.id || playerId, true)
	},
	{
		params: [
			{
				name: 'id',
				paramType: 'playerId',
				optional: true,
			},
		],
		restricted: 'group.admin',
	},
)
