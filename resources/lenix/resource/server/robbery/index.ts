import { MIN_TEAMS_TO_START_ROBBERY, MISSION_PRICE } from "common/robbery"
import type { Team } from "types/index"
import "./mission"
import { startRobbery } from "./mission"
import { server } from "lenix/server"

export abstract class Teams {
	private static readonly teams = new Map<number, Team>()
	private static robberyActive = false

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

		if (!this.robberyActive && this.teams.size >= MIN_TEAMS_TO_START_ROBBERY) {
			this.robberyActive = true
			startRobbery()
		}
		this.updatePlayer(leader, this.teams.get(leader))
	}

	static delete(leader: number) {
		const team = this.teams.get(leader)
		if (!team) throw new Error(`Failed to delete team with player<${leader}>`)


		this.updatePlayer(team.members, undefined)
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
			notify(inviter, {
				type: 'error',
				title: 'Player is already in a/the team'
			})
			return
		}

		emitNet('lenix:client:robbery:receiveInvite', invited, inviter)

		const handler = (inviter: number, decision: 'cancel' | 'confirm') => {
			if (decision === 'confirm') this.join(inviter, invited)

			else if (decision === 'cancel') { /* maybe notify the inviter? whatever */ }

			removeEventListener('lenix:server:robbery:inviteDone', handler)
		}
		onNet('lenix:server:robbery:inviteDone', handler)
	}

	static remove(remover: number, removed: number) {
		const team = this.teams.get(remover)
		if (!team) throw new Error(`Failed to kick a teammate with player<${remover}>`)

		if (remover === removed) throw new Error(`Exploit attempt by player<${remover}>`)

		team.members = team.members.filter(memb => memb !== removed)
		this.updatePlayer([remover, removed], team)
	}

	static leave(playerId: number) {
		const team = [...this.teams.values()].find(team => team.members.includes(playerId))
		if (!team) throw new Error(`Failed to leave a team with player<${playerId}>`)

		team.members = team.members.filter(teammate => teammate !== playerId)
		this.updatePlayer(playerId, undefined)
	}

	static updatePlayer(playerId: number, team: Team | undefined): void
	static updatePlayer(playerIds: number[], team: Team | undefined): void
	static updatePlayer(target: number | number[], team: Team | undefined) {
		const ids = Array.isArray(target) ? target : [target]

		for (const id of ids) emitNet('lenix:client:robbery:updatePlayer', id, team)
	}

	static join(inviter: number, invited: number) {
		const team = Teams.get(inviter)
		if (!team) throw new Error(`Error occured happend while serving player<${invited}>`)

		notify(inviter, {
			title: `Player #${invited} joined the team`
		})
		team.members.push(invited)
		this.updatePlayer([inviter, invited], team)
		this.attendRobbery(invited)
	}

	static attendRobbery(invited: number) {
		if (!this.robberyActive) return

		notify(invited, {
			title: 'A new truck to rob can be found in the map'
		})
	}
}

const notify = (source: number, data: {
	title: string
	type?: 'error'
	description?: string
}) => emitNet('ox_lib:notify', source, data)

onNet('lenix:server:robbery:createTeam', async () => {
	Teams.create(source)
})

onNet('lenix:server:robbery:invite', (playerId: number) => {
	Teams.invite(source, playerId)
})

onNet('lenix:server:robbery:kickMember', (target: number) => {
	Teams.remove(source, target)
})

onNet('lenix:server:robbery:deleteTeam', () => {
	Teams.delete(source)
})

onNet('lenix:server:robbery:leaveTeam', () => {
	Teams.leave(source)
})

on('ox:playerLogout', (playerId: number) => {
	Teams.delete(playerId)
})