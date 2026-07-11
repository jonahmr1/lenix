import type { Team, Vector4 } from "types/index";
import { spawnPed } from "../_lib";
import { cache, notify, registerContext, showContext, triggerServerCallback } from "@overextended/ox_lib/client";

const PED_COORDS: Vector4 = [16.1564, -615.8132, 31.7635, 260.8470]
const MISSION_PRICE = 2000

let team: Team | undefined

const isInTeam = () => !!team?.teammates.find(teammate => teammate === cache.serverId)
const isLeader = () => team?.leader === cache.serverId

const refreshContext = () => registerContext({
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
			}
		},
		{
			title: 'Invite teammate',
			disabled: !isLeader(),
			onSelect: () => {
				
			}
		},
		...(!isInTeam() ? [] : isLeader()
			? [{
				title: 'Destroy Team',
				onSelect: () => {
					emitNet('lenix:server:robbery:destroyteam')
					team = undefined
				}
			}] : [{
				title: 'Leave Team',
				onSelect: () => {
					emitNet('lenix:server:robbery:leaveteam')
					team = undefined
				}
			}]
		)
	]
})

onNet('lenix:client:robbery:updateteam', (updatedTeam: Team) => {
	team = updatedTeam
})

setImmediate(async () => {
	const entity = await spawnPed(PED_COORDS)
	if (!entity) return


	globalThis.exports.ox_target.addLocalEntity(entity, {
		label: 'Robbery Mission',
		onSelect: () => showContext('robbery-mission')
	})
})