import { onClientCallback } from "@overextended/ox_lib/server"
import { MIN_TEAMS_TO_START_ROBBERY, MISSION_PRICE } from "common/robbery"
import type { Team } from "types/index"
import "./mission"
import { addPlayerToRobbery, startRobbery } from "./mission"

export const teams = new Map<number, Team>()
export let states = {
	isRunning: false
}

const notify = (source: number, data: {
	title: string
	type?: 'error'
	description?: string
}) => emitNet('ox_lib:notify', source, data)

const refreshTeam = (team: Team) => {
	team.teammates.forEach(teammate => {
    emitNet('lenix:client:robbery:updateteam', teammate, team)
  })
}

const createTeam = () => {
	teams.set(source, { leader: source, teammates: [source] })

	if (!states.isRunning && teams.size >= MIN_TEAMS_TO_START_ROBBERY) {
		states.isRunning = true
		startRobbery()
	}
}

const deleteTeam = (leader: number) => {
	teams.delete(leader)
}

onClientCallback('lenix:server:robbery:getTeam', (source) => {
	return teams.get(source)
})

onNet('lenix:server:robbery:createteam', async () => {
	const moneyAmount = globalThis.exports.ox_inventory.GetItemCount(source, 'money')
	if (moneyAmount < MISSION_PRICE) {
		notify(source, {
			type: 'error',
			title: 'Not enough money!',
			description: `You need ${MISSION_PRICE - moneyAmount} more`
		})
		return
	}

	const result = globalThis.exports.ox_inventory.RemoveItem(source, 'money', MISSION_PRICE)
	const [success, response] = Array.isArray(result) ? result : [result, undefined]
	if (!success) throw new Error(`Could not create team for player<${source}>, reason: ${response}`)

	createTeam()
})

on('ox:playerLogout', (playerId: number) => {
	deleteTeam(playerId)
})

onNet('lenix:server:robbery:leaveteam', () => {
  const team = [...teams.values()].find(team => team.teammates.includes(source))
  if (!team) return

  team.teammates = team.teammates.filter(teammate => teammate !== source)
	refreshTeam(team)
})

onNet('lenix:server:robbery:destroyteam', () => {
	const team = teams.get(source)
	if (!team) return

	team.teammates.forEach(teammate => {
		emitNet('lenix:client:robbery:removefromteam', teammate)
	})
  teams.delete(source)
})

onNet('lenix:server:robbery:kickteammate', (target: number) => {
	const team = teams.get(source)
	if (!team) return

  team.teammates = team.teammates.filter(teammate => teammate !== target)
	refreshTeam(team)
})

onNet('lenix:server:robbery:jointeam', (leader: number) => {
	const team = teams.get(leader)
	if (!team) return

	team?.teammates.push(source)
	refreshTeam(team)
	emitNet('ox_lib:notify', source, {
		title: 'New player joined the team'
	})
	if (states.isRunning) addPlayerToRobbery(source)
})

onNet('lenix:server:robbery:invite', (playerId: number) => {
	if (!GetPlayerPed(playerId.toString()) || playerId === source) {
		emitNet('ox_lib:notify', source, {
			type: 'error',
			title: 'Unvalid Id'
		})
		return
	}
	
	const targetTeam = [...teams.values()].find(team => team.teammates.includes(playerId))
  if (targetTeam) {
		emitNet('ox_lib:notify', source, {
			type: 'error',
			title: 'Player is already in another team'
		})
		return
	}

	emitNet('lenix:client:robbery:receiveinvite', playerId, source)
})