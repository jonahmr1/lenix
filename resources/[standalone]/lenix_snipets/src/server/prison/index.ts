import { GetPlayer, type OxPlayer } from "@overextended/ox_core/server";
import { addCommand, triggerClientCallback } from "@overextended/ox_lib/server";
import { oxmysql } from "@overextended/oxmysql";

const timeLeft: Record<string, number> = {}
const timeouts: Record<string, CitizenTimer> = {}

const imprisonPlayer = (player: OxPlayer, period: number): CitizenTimer | never => {
	const charId = player.charId
	if (!charId) throw new Error('charId was not truthy')

	SetEntityCoords(player.ped, 1680.1442, 2512.8276, 45.5648, false, false, false, false)
	SetEntityHeading(player.ped, 335.5214)
	
	timeLeft[charId] = period

	const interval = setInterval(() => {
		timeLeft[charId] = --period
	}, 60_000)

	return setTimeout(() => {
		releasePrisoner(player)
		clearInterval(interval)
	}, period * 60_000)
}

const releasePrisoner = async (player: OxPlayer) => {
	if (!player.charId) throw new Error('charId was not truthy')
	const timeout = timeouts[player.charId]
	if (!timeout) throw new Error('timeout was not truthy')

	SetEntityCoords(player.ped, 1845.8193, 2585.8560, 45.6720, false, false, false, false)
	SetEntityHeading(player.ped, 269.8568)

	await oxmysql.update(
		`INSERT INTO lenix (charId, jailPeriod)
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE
				jailPeriod = VALUES(jailPeriod)`,
		[player.charId, 0]
	)
	clearTimeout(timeout)
}

addCommand(
	'jail',
	async (source) => {
		const res = await triggerClientCallback<{
			id: string
			period: string
		}>('ox:imprisonPlayer', source)
		if (!res) return

		const { id, period } = res
		
		const player = GetPlayer(id)
		if (!player) return emitNet('ox_lib:notify', source, { type: 'error', title: 'No player found with that id' })

		const timeout = imprisonPlayer(player, Number(period))
		if (!timeout) return
		timeouts[id] = timeout
	},
	{
		help: "Imprison a player",
		restricted: "group.admin"
	}
)

addCommand(
	'releasePrisoner',
	async (source) => {
		const res = await triggerClientCallback<{
			id: string
		}>('ox:releasePrisoner', source)
		if (!res) return

		const player = GetPlayer(res.id)
		if (!player) return emitNet('ox_lib:notify', source, { type: 'error', title: 'No player found with that id' })

		releasePrisoner(player)
	},
	{
		help: "Imprison a player",
		restricted: "group.admin"
	}
)

setImmediate(async () => {
	const res = await oxmysql.query(`
		CREATE TABLE IF NOT EXISTS lenix (
			charId INT UNSIGNED NOT NULL PRIMARY KEY,
			jailPeriod INT NOT NULL DEFAULT 0,
			FOREIGN KEY (charId)
				REFERENCES characters(charId)
				ON DELETE CASCADE
		)
	`)
	if (!res) throw new Error("Failed to query 'lenix'")
})

onNet('ox:sendToPrison', () => {
	const player = GetPlayer(source)
	if (!player?.charId) return
	if (timeLeft[player.charId] == 0) return

	SetEntityCoords(player.ped, 1680.1442, 2512.8276, 45.5648, false, false, false, false)
})

on('ox:playerLoaded', async (playerId: number) => {
  const player = GetPlayer(playerId)
	if (!player?.charId) return

	if (timeLeft[player.charId] == 0) return

	const row = await oxmysql.single<{ jailPeriod: number }>(
		'SELECT jailPeriod FROM lenix WHERE charId = ?',
		[player.charId]
	)
	if (!row) return
	imprisonPlayer(player, row.jailPeriod)
});

on('ox:playerLogout', async (playerId: number) => {
  const player = GetPlayer(playerId)
	if (!player?.charId) return
	if (timeLeft[player.charId] == 0) return

	await oxmysql.update(
		`INSERT INTO lenix (charId, jailPeriod)
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE
				jailPeriod = VALUES(jailPeriod)`,
		[player.charId, timeLeft[player.charId]]
	)
	const interval = timeouts[playerId]
	if (!interval) return
	clearInterval(interval)
});
