import { onClientCallback } from "@overextended/ox_lib/server"
import { MIN_TEAMS_TO_START_ROBBERY, MISSION_PRICE } from "common/robbery"
import type { Team } from "types/index"
import "./mission"
import { addPlayerToRobbery, startRobbery } from "./mission"
import { server } from "lenix/server"

abstract class Teams {
	private static readonly teams = new Map<number, Team>()

	static create(leader: number) {
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

		this.teams.set(source, { leader, members: [source] })

		
		// if (!states.isRunning && teams.size >= MIN_TEAMS_TO_START_ROBBERY) {
		// 	states.isRunning = true
		// 	startRobbery()
		// }
	}

	static delete(leader: number) {
		const team = this.teams.get(leader)
		if (!team) throw new Error(`Failed to delete team with player<${leader}>`)
	
		this.teams.delete(leader)
	}

	static get(leader: number) {
		return this.teams.get(leader)
	}

	static invite(inviter: number, playerId: number) {
		if (Teams.get(inviter)?.leader !== inviter)
			throw new Error(`Exploit attempted by player<${inviter}>`)
	
		if (!server.entity.handleFromSource(playerId) || playerId === inviter) {
			notify(inviter, {
				type: 'error',
				title: 'Unvalid Id'
			})
			return
		}
	
		const targetTeam = [...this.teams.values()].find(team => team.members.includes(playerId))
		if (targetTeam) {
			emitNet('ox_lib:notify', inviter, {
				type: 'error',
				title: 'Player is already in a/the team'
			})
			return
		}
	
		emitNet('lenix:client:robbery:receiveinvite', playerId, inviter)

		const handler = (inviter: number, decision: 'cancel' | 'confirm') => {
			const team = Teams.get(inviter)
			if (!team) throw new Error(`Error occured happend while serving player<${playerId}>`)
		
			if (decision === 'confirm') {
				notify(inviter, {
					title: `Player #${playerId} joined the team`
				})
				team.members.push(playerId)
			} else if (decision === 'cancel') {
				// maybe notify the inviter? whatever
			}
			
			removeEventListener('lenix:server:robbery:invitedone', handler)
		
			// refreshTeam(team)
			// if (states.isRunning) addPlayerToRobbery(source)
		}
		onNet('lenix:server:robbery:invitedone', handler)
	}

	static remove(playerId: number, member: number) {
		const team = this.teams.get(source)
		if (!team) throw new Error(`Failed to kick a teammate with player<${source}>`)

		team.members = team.members.filter(memb => memb !== member)
		// refreshTeam(team)
	}

	static leave(playerId: number) {
		const team = [...this.teams.values()].find(team => team.members.includes(playerId))
		if (!team) throw new Error(`Failed to leave a team with player<${playerId}>`)
	
		team.members = team.members.filter(teammate => teammate !== playerId)
		// refreshTeam(team)
	}
}

export let states = {
	isRunning: false
}

const notify = (source: number, data: {
	title: string
	type?: 'error'
	description?: string
}) => emitNet('ox_lib:notify', source, data)

const refreshTeam = (team: Team) => {
	team.members.forEach(teammate => {
		emitNet('lenix:client:robbery:updateteam', teammate, team)
	})
}

onNet('lenix:server:robbery:createteam', async () => {
	Teams.create(source)
})

onNet('lenix:server:robbery:invite', (playerId: number) => {
	Teams.invite(source, playerId)
})

onNet('lenix:server:robbery:kickteammate', (target: number) => {
	Teams.remove(source, target)
})

onNet('lenix:server:robbery:deleteteam', () => {
	Teams.delete(source)

	// team.teammates.forEach(teammate => {
	// 	emitNet('lenix:client:robbery:removefromteam', teammate)
	// })
})

onNet('lenix:server:robbery:leaveteam', () => {
	Teams.leave(source)
})

on('ox:playerLogout', (playerId: number) => {
	Teams.delete(playerId)
})