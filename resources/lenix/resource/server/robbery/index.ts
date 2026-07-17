import { onClientCallback } from "@overextended/ox_lib/server"
import { MIN_TEAMS_TO_START_ROBBERY, MISSION_PRICE } from "common/robbery"
import type { Team } from "types/index"
import "./mission"
import { addPlayerToRobbery, startRobbery } from "./mission"
import { server } from "lenix/server"

abstract class Teams {
	private static readonly teams = new Map<number, Team>()

	static create(leader: number) {
		const moneyAmount = globalThis.exports.ox_inventory.GetItemCount(leader, 'money')
		if (moneyAmount < MISSION_PRICE) {
			notify(leader, {
				type: 'error',
				title: 'Not enough money!',
				description: `You need ${MISSION_PRICE - moneyAmount} more`
			})
			return
		}

		const result = globalThis.exports.ox_inventory.RemoveItem(leader, 'money', MISSION_PRICE)
		const [success, response] = Array.isArray(result) ? result : [result, undefined]
		if (!success) throw new Error(`Could not create team for player<${leader}>, reason: ${response}`)

		this.teams.set(leader, { leader, members: [leader] })

		// if (!states.isRunning && teams.size >= MIN_TEAMS_TO_START_ROBBERY) {
		// 	states.isRunning = true
		// 	startRobbery()
		// }
		this.updatePlayer(leader, this.teams.get(leader))
	}

	static delete(leader: number) {
		const team = this.teams.get(leader)
		if (!team) throw new Error(`Failed to delete team with player<${leader}>`)
			

		team.members.forEach(member => {
			this.updatePlayer(member, undefined)
		})
		this.teams.delete(leader)
	}

	static get(leader: number) {
		return this.teams.get(leader)
	}

	static invite(inviter: number, invited: number) {
		if (Teams.get(inviter)?.leader !== inviter)
			throw new Error(`Exploit attempted by player<${inviter}>`)
	
		if (!server.entity.handleFromSource(invited) || invited === inviter) {
			notify(inviter, {
				type: 'error',
				title: 'Unvalid Id'
			})
			return
		}
	
		const targetTeam = [...this.teams.values()].find(team => team.members.includes(invited))
		if (targetTeam) {
			emitNet('ox_lib:notify', inviter, {
				type: 'error',
				title: 'Player is already in a/the team'
			})
			return
		}
	
		emitNet('lenix:client:robbery:receiveinvite', invited, inviter)

		const handler = (inviter: number, decision: 'cancel' | 'confirm') => {
			const team = Teams.get(inviter)
			if (!team) throw new Error(`Error occured happend while serving player<${invited}>`)
		
			if (decision === 'confirm') {
				notify(inviter, {
					title: `Player #${invited} joined the team`
				})
				team.members.push(invited)
				this.updatePlayer(inviter, team)
				this.updatePlayer(invited, team)
			} else if (decision === 'cancel') {
				// maybe notify the inviter? whatever
			}
			
			removeEventListener('lenix:server:robbery:invitedone', handler)
			// if (states.isRunning) addPlayerToRobbery(source)
		}
		onNet('lenix:server:robbery:invitedone', handler)
	}

	static remove(remover: number, removed: number) {
		const team = this.teams.get(remover)
		if (!team) throw new Error(`Failed to kick a teammate with player<${remover}>`)

		if (remover === removed) throw new Error(`Exploit attempt by player<${remover}>`)

		team.members = team.members.filter(memb => memb !== removed)
		this.updatePlayer(remover, team)
		this.updatePlayer(removed, undefined)
	}

	static leave(playerId: number) {
		const team = [...this.teams.values()].find(team => team.members.includes(playerId))
		if (!team) throw new Error(`Failed to leave a team with player<${playerId}>`)
	
		team.members = team.members.filter(teammate => teammate !== playerId)
		this.updatePlayer(playerId, undefined)
	}

	static updatePlayer(playerId: number, team: Team | undefined) {
		emitNet('lenix:client:robbery:updatePlayer', playerId, team)
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
})

onNet('lenix:server:robbery:leaveteam', () => {
	Teams.leave(source)
})

on('ox:playerLogout', (playerId: number) => {
	Teams.delete(playerId)
})