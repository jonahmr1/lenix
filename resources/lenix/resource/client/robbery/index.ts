import type { Team, Vector4 } from "types/index";
import { spawnPed } from "../_lib";
import { cache, inputDialog, notify, registerContext, showContext, showTextUI, triggerServerCallback } from "@overextended/ox_lib/client";
import { MISSION_PRICE } from "common/robbery";

const PED_COORDS: Vector4 = [16.1564, -615.8132, 31.7635, 260.8470]

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
				onSelect: async () => {
					const input = await inputDialog('Invite a teammate', [
						{
							type: 'number',
							label: 'Player Id'
						}
					], {})
					if (!input) return

					emitNet('lenix:server:robbery:invite', input[0])
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
				title: 'Destroy team',
				disabled: !isLeader(),
				onSelect: () => {
					emitNet('lenix:server:robbery:destroyteam')
					team = undefined
					refreshContext()
				}
			},
			{
				title: 'Leave team',
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
		options: (() => {
			const teammates = team?.teammates.filter(t => t !== team?.leader) ?? []
			return teammates.length > 0
				? teammates.map(teammate => ({
						title: `${teammate}`,
						onSelect: () => emitNet('lenix:server:robbery:kickteammate', teammate)
					}))
				: [{ title: 'No teammates found', readOnly: true }]
		})()
	})
}

onNet('lenix:client:robbery:updateteam', (updatedTeam: Team) => {
	team = updatedTeam
	refreshContext()
})

onNet('lenix:server:robbery:receiveinvite', (inviter: number) => {
	showTextUI(`Robbery invite received from player(${inviter})\n8 - Accept\n9 - Reject`, {
		position: 'bottom-center'
	})
	
	const tick = setTick(() => {
		if (IsControlJustPressed(0, 162)) {
			emitNet('lenix:server:robbery:addteammate', inviter)
		} else if (IsControlJustPressed(0, 163)) {
			clearTick(tick)
		}
	})
})

setImmediate(async () => {
	const entity = await spawnPed(PED_COORDS)
	if (!entity) return

	globalThis.exports.ox_target.addLocalEntity(entity, {
		label: 'Robbery Mission',
		onSelect: () => {
			refreshContext()
			showContext('robbery-mission')
		}
	})
})