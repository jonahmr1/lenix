import type { Team, Vector4 } from "types/index";
import { spawnPed, useTimer } from "../_lib";
import { alertDialog, cache, hideTextUI, inputDialog, notify, registerContext, showContext, showTextUI, triggerServerCallback } from "@overextended/ox_lib/client";
import { MISSION_PRICE } from "common/robbery";
import './mission'
import { tick } from "./mission";

const PED_COORDS: Vector4 = [16.1564, -615.8132, 31.7635, 260.8470]

export let team: Team | undefined
let inviteTick: number

const isInTeam = () => !!team?.teammates.find(teammate => teammate === cache.serverId)
const isLeader = () => team?.leader === cache.serverId

const createTeam = async () => {
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

const refreshContext = () => {
	registerContext({
		id: 'robbery-mission',
		title: 'Robbery Mission',
		options: [
			{
				title: `Create team ($${MISSION_PRICE})`,
				disabled: isLeader() || isInTeam(),
				onSelect: async () => {
					createTeam()
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
					emitNet('lenix:server:robbery:leaveteam')
					team = undefined
					refreshContext()
				}
			},
			{
				title: 'Delete team',
				disabled: !isLeader(),
				onSelect: () => {
					emitNet('lenix:server:robbery:destroyteam')
					refreshContext()
				}
			},
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

onNet('lenix:client:robbery:removefromteam', () => {
	team = undefined
	clearTick(tick)
	refreshContext()
})

onNet('lenix:client:robbery:receiveinvite', (inviter: number) => {
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
        content: `The player #${inviter} is inviting you to join the robbery mission`,
				centered: true,
				cancel: true
      })
      if (res === 'cancel') return
      emitNet('lenix:server:robbery:jointeam', inviter)
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