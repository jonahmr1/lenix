import type { Team } from "types/index";
import { alertDialog, cache, createPed, hideTextUI, inputDialog, registerContext, showContext, showTextUI, triggerServerCallback } from "@overextended/ox_lib/client";
import { MISSION_PRICE, PED_COORDS } from "common/robbery";
import './mission'
import { tick } from "./mission";
import { useTimer } from "lenix/client";

export let team: Team | undefined
let inviteTick: number

const isInTeam = () => !!team?.members.find(member => member === cache.serverId)
const isLeader = () => team?.leader === cache.serverId

const refreshContext = async () => {
	registerContext({
		id: 'robbery-mission',
		title: 'Robbery Mission',
		options: [
			{
				title: `Create team ($${MISSION_PRICE})`,
				disabled: isLeader() || isInTeam(),
				onSelect: async () => {
					emitNet('lenix:server:robbery:createTeam')
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
				title: 'Leave team',
				disabled: !isInTeam() || isLeader(),
				onSelect: () => {
					emitNet('lenix:server:robbery:leaveTeam')
				}
			},
			{
				title: 'Delete team',
				disabled: !isLeader(),
				onSelect: () => {
					emitNet('lenix:server:robbery:deleteTeam')
				}
			},
		]
	})

	registerContext({
		id: 'robbery-mission-kick',
		title: 'Kick a teammate',
		options: (() => {
			const teammates = team?.members.filter(member => member !== team?.leader) ?? []
			return teammates.length > 0
				? teammates.map(teammate => ({
					title: `${teammate}`,
					onSelect: () => emitNet('lenix:server:robbery:kickteammate', teammate)
				}))
				: [{ title: 'No teammates found', readOnly: true }]
		})()
	})
}

onNet('lenix:client:robbery:receiveInvite', (inviter: number) => {
	if (inviteTick) return

	const stop = useTimer(
		10000,
		1000,
		(timeLeft) => {
			showTextUI(`E - Show robbery invite - ${Math.ceil(timeLeft / 1000)}s`, {
				position: 'bottom-center'
			})
		},
		() => {
			hideTextUI()
			clearTick(inviteTick)
			inviteTick = 0
		}
	)

	inviteTick = setTick(async () => {
		if (IsControlJustPressed(0, 38)) {
			stop()
			hideTextUI()
			clearTick(inviteTick)
			inviteTick = 0
			const res = await alertDialog({
				header: 'Robbery Invite',
				content: `The player #${inviter} is inviting you to join his to a robbery mission`,
				centered: true,
				cancel: true
			})
			emitNet('lenix:server:robbery:invitedone', inviter, res satisfies 'cancel' | 'confirm')
		}
	})
})

onNet('lenix:client:robbery:updatePlayer', (updatedTeam: Team | undefined) => {
	if (!team) {
		clearTick(tick)
	}
	team = updatedTeam
	refreshContext()
})

setImmediate(async () => {
	const entity = await createPed('a_m_m_prolhost_01', ...PED_COORDS, true)
	if (!entity) return

	globalThis.exports.ox_target.addLocalEntity(entity, {
		label: 'Robbery Mission',
		onSelect: () => {
			showContext('robbery-mission')
		}
	})
})