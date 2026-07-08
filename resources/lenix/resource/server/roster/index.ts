import { GetPlayer } from "@overextended/ox_core/server";
import { oxmysql } from "@overextended/oxmysql";
import type { Officer, PartialOfficer, Officers as IOfficers } from "types/index";

abstract class Officers {
	private static readonly officers: IOfficers

	public static set add(officer: Officer) {
		this.officers[officer.playerId] = officer;
	}

	public static get all(): Officers {
		return this.officers
	}

	public static updateOfficer({ playerId, ...props}: PartialOfficer) {
		const officer = this.officers[playerId]
		if (!officer) throw new Error(`Could not find the officer<${playerId}>`)

		Object.assign(officer, Object.fromEntries(
			Object.entries(props).filter(([_, v]) => v)
		))
	}

	public static forEach(cb: (officer: Officer) => void) {
		Object.entries(this.officers).forEach(([, officer]) => cb(officer))
	}
}

onNet('lenix:server:roster:updateOfficer', Officers.updateOfficer)

on('ox:playerLoaded', async (playerId: number, _userId: number, charId: number) => {
	const player = GetPlayer(playerId)
	if (!player) throw new Error(`Player<${playerId}> was not found`)

	const grade = player.getGroup('police')
	console.debug(grade)

	const callsign = await oxmysql.scalar<string>('SELECT `callsign` FROM `lenix` WHERE `charId` = ? LIMIT 1', [charId])
	console.debug(callsign)

	const officer: Officer = {
		playerId,
		callsign,
		name: `${player.get('lastname')} ${player.get('firstName')}`,
		duty_state: 'off',
		talk_state: 'off'
	}
	Officers.add = officer

	Officers.forEach(({ playerId }) => {
		emitNet('lenix:client:roster:updateOfficers', playerId, Officers.all)
	})
})
