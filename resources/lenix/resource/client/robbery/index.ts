import type { Team, Vector4 } from "types/index";
import { spawnPed } from "../_lib";
import { cache, notify, registerContext, showContext, triggerServerCallback } from "@overextended/ox_lib/client";

const PED_COORDS: Vector4 = [16.1564, -615.8132, 31.7635, 260.8470]
const MISSION_PRICE = 2000

let team: Team | undefined

const isInTeam = () => !!team?.teammates.find(teammate => teammate === cache.serverId)
const isLeader = () => team?.leader === cache.serverId

const refreshContext = () => {
	registerContext({
		id: 'robbery-mission',
		title: 'Robbery Mission',
		options: [
			{
				title: `Create team ($${MISSION_PRICE})`,
				disabled: isLeader() || isInTeam(),
				onSelect: async () => {
					const moneyAmount = globalThis.exports.ox_inventory.GetItemCount('money')
					if (moneyAmount < MISSION_PRICE) {
						notify({
							type: 'error',
							title: 'Not enough money!',
							description: `You need ${MISSION_PRICE - moneyAmount} more`
						})
						return
					}
					const teamCreated = await triggerServerCallback<Team | undefined>('lenix:server:robbery:createteam', null)
					if (!teamCreated) return
	
					team = teamCreated
					refreshContext()
				}
			},
			{
				title: 'Invite teammate',
				disabled: !isLeader(),
				onSelect: () => {
					
				}
			},
			{
				title: 'Kick teammate',
				disabled: !isLeader(),
				onSelect: () => {
					showContext('robbery-mission-kick')
				}
			},
			{
				title: 'Destroy Team',
				disabled: !isLeader(),
				onSelect: () => {
					emitNet('lenix:server:robbery:destroyteam')
					team = undefined
					refreshContext()
				}
			},
			{
				title: 'Leave Team',
				disabled: !isInTeam() || isLeader(),
				onSelect: () => {
					emitNet('lenix:server:robbery:leaveteam')
					team = undefined
					refreshContext()
				}
			}
		]
	})

	registerContext({
		id: 'robbery-mission-kick',
		title: 'Kick a teammate',
		options: team?.teammates.map(teammate => ({
			title: `${teammate}`,
			onSelect: () => {
				emitNet('lenix:server:robbery:kickteammate', teammate)
			}
		})) ?? [{
			title: 'No teammate was found',
			readOnly: true
		}]
	})
}

onNet('lenix:client:robbery:updateteam', (updatedTeam: Team) => {
	team = updatedTeam
	refreshContext()
})

setImmediate(async () => {
	const entity = await spawnPed(PED_COORDS)
	if (!entity) return


	globalThis.exports.ox_target.addLocalEntity(entity, {
		label: 'Robbery Mission',
		onSelect: () => showContext('robbery-mission')
	})
})