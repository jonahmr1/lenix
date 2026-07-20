import { GetPlayer } from "@overextended/ox_core/server";
import { notify } from "@overextended/ox_lib/client";
import { oxmysql } from "@overextended/oxmysql";
import type { Officer, PartialOfficer, Officers as IOfficers } from "types/index";

abstract class Officers {
	private static readonly officers: IOfficers = {}

	public static set add(officer: Officer) {
		this.officers[officer.playerId] = officer;
	}

	public static get all(): IOfficers {
		return this.officers
	}

	public static forEach = (cb: (officer: Officer) => void) => {
		Object.entries(this.officers).forEach(([, officer]) => cb(officer))
	}

	private static refreshOfficers = () => {
		this.forEach(({ playerId }) => {
			emitNet('lenix:client:roster:refreshOfficers', playerId, this.all)
		})
	}

	public static updateOfficer = async ({ playerId, ...props }: PartialOfficer) => {
		const officer = this.officers[playerId]
		if (!officer) throw new Error(`Could not find the officer<${playerId}>`)

		if (props.name) throw new Error(`You can not change officer<${playerId}> name`)

		if (props.callsign) {
			const player = GetPlayer(playerId)
			if (!player) throw new Error(`Could not get player<${playerId}>`)

			const charId = player.charId
			if (!charId) throw new Error(`Could not find charId the player<${playerId}>`)

			const callsignsRows = await oxmysql.query<{ callsign: string }[]>('SELECT `callsign` FROM `lenix`')
			if (!callsignsRows) throw new Error(`Failed to get table callsigns`)

			const callsignTaken = callsignsRows.some(callsignRows => callsignRows.callsign === props.callsign?.toLowerCase().trim())
			if (callsignTaken) {
				emitNet('ox_lib:notify', playerId, {
					title: 'Failed to update callsign',
					type: 'error',
					description: 'That callsign already belongs to an officer'
				} satisfies Parameters<typeof notify>[0])
				return
			}

			const affectedRows = await oxmysql.update('UPDATE lenix SET callsign = ? WHERE charId = ?', [
				props.callsign, charId
			])
			
			if (!affectedRows) throw new Error(`Failed to update the callsign<${props.callsign}> for player<${playerId}>`)
		}

		this.officers[playerId] = {
			...officer,
			...props
		}

		this.refreshOfficers()
	}

	public static addOfficer = async (playerId: number) => {
		const player = GetPlayer(playerId)
		if (!player || !player.charId) throw new Error(`Failed to get player<${playerId}> properly: charId<${player?.charId}>`)
	
		const grade = player.getGroup('police')
		if (!grade) return
	
		const callsign = await oxmysql.scalar<string | null>('SELECT `callsign` FROM `lenix` WHERE `charId` = ? LIMIT 1', [player.charId])
	
		this.add = {
			playerId,
			callsign: callsign ?? 'unset',
			name: `${player.get('lastName')} ${player.get('firstName')}`,
			duty_state: 'off',
			talk_state: 'off'
		}
	
		this.refreshOfficers()
	}

	public static removeOfficer = (playerId: number) => {
		if (!this.officers[playerId]) return
		delete this.officers[playerId]
		this.refreshOfficers()
	}
}

onNet('lenix:server:roster:updateOfficer', Officers.updateOfficer)

onNet('lenix:server:roster:addOfficer', Officers.addOfficer)

on('ox:playerLoaded', (playerId: number) => {
	Officers.addOfficer(playerId)
})

on('ox:setGroup', (playerId: number, groupName: string) => {
	if (groupName !== 'police') {
		Officers.removeOfficer(playerId)
		return
	}
	Officers.addOfficer(playerId)
});

on('ox:playerLogout', Officers.removeOfficer)