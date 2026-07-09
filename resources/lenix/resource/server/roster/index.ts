import { GetPlayer } from "@overextended/ox_core/server";
import { oxmysql } from "@overextended/oxmysql";
import type { Officer, PartialOfficer, Officers as IOfficers } from "types/index";

abstract class Officers {
	private static readonly officers: IOfficers = {}

	public static set add(officer: Officer) {
		this.officers[officer.playerId] = officer;
		console.debug(this.officers)
	}

	public static get all(): Officers {
		return this.officers
	}

	public static updateOfficer({ playerId, ...props}: PartialOfficer) {
		const officer = this.officers[playerId]
		if (!officer) throw new Error(`Could not find the officer<${playerId}>`)
		console.debug(officer)

		Object.assign(officer, Object.fromEntries(
			Object.entries(props).filter(([_, v]) => v)
		))
		console.debug(officer)
	}

	public static forEach(cb: (officer: Officer) => void) {
		Object.entries(this.officers).forEach(([, officer]) => cb(officer))
	}
}

const addOfficer = async (playerId: number, charId: number) => {
	const player = GetPlayer(playerId)
	if (!player) throw new Error(`Player<${playerId}> was not found`)

	const grade = player.getGroup('police')
	if (!grade) return
	
	const callsign = await oxmysql.scalar<string | null>('SELECT `callsign` FROM `lenix` WHERE `charId` = ? LIMIT 1', [charId])

	Officers.add = {
		playerId,
		callsign: callsign ?? 'unset',
		name: `${player.get('lastName')} ${player.get('firstName')}`,
		duty_state: 'off',
		talk_state: 'off'
	}

	Officers.forEach(({ playerId }) => {
		emitNet('lenix:client:roster:updateOfficers', playerId, Officers.all)
	})
}

on('ox:playerLoaded', (playerId: number, _userId: number, charId: number) => {
	addOfficer(playerId, charId)
})

onNet('lenix:server:roster:updateOfficer', Officers.updateOfficer)

onNet('lenix:server:roster:addOfficer', (charId: number) => {
	addOfficer(source, charId)
})
