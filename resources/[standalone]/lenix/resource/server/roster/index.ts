import { GetPlayer } from "@overextended/ox_core/server";
import { oxmysql } from "@overextended/oxmysql";
import type { Officer } from "types/index";

abstract class Officers {
	private static readonly officers: Officer[] = []

	public static set add(officer: Officer) {
		this.officers.push(officer)
	}

	public static get all(): Officer[] {
		return this.officers
	}
}

on('ox:playerLoaded', async (playerId: number, userId: number, charId: number) => {
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
	
	const officers = Officers.all
	officers.forEach(officer => {
		emitNet('lenix:client:roster:updateOfficers', officer.playerId, officers)
	})
});
