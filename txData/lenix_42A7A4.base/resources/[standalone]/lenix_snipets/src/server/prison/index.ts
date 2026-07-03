import { GetPlayer, type OxPlayer } from "@overextended/ox_core/server";
import { addCommand, triggerClientCallback } from "@overextended/ox_lib/server";
import { oxmysql } from "@overextended/oxmysql";

type JailHandles = { timeout: CitizenTimer; interval: CitizenTimer }

const timeLeft: Record<string, number> = {}
const handles: Record<string, JailHandles> = {}

const imprisonPlayer = (player: OxPlayer, period: number): JailHandles => {
	const charId = player.charId
	if (!charId) throw new Error('charId was not truthy')
	SetEntityCoords(player.ped, 1680.1442, 2512.8276, 45.5648, false, false, false, false)
	SetEntityHeading(player.ped, 335.5214)

	timeLeft[charId] = period
	const interval = setInterval(() => {
		timeLeft[charId] = --period
	}, 60_000)
	const timeout = setTimeout(() => {
		releasePrisoner(player)
	}, period * 60_000)

	return { timeout, interval }
}

const releasePrisoner = async (player: OxPlayer) => {
	if (!player.charId) throw new Error('charId was not truthy')
	const singleHandles = handles[player.charId]
	if (!singleHandles) throw new Error('timeout was not truthy')
	SetEntityCoords(player.ped, 1845.8193, 2585.8560, 45.6720, false, false, false, false)
	SetEntityHeading(player.ped, 269.8568)
	await oxmysql.update(
		`INSERT INTO lenix (charId, jailPeriod)
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE
				jailPeriod = VALUES(jailPeriod)`,
		[player.charId, 0]
	)
	clearTimeout(singleHandles.timeout)
	clearInterval(singleHandles.interval)
	delete handles[player.charId]
	delete timeLeft[player.charId]
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
		const charId = player.charId
		if (!charId) throw new Error('charId was not truthy')
		handles[charId] = imprisonPlayer(player, Number(period))
	},
	{
		help: "Imprison a player",
		restricted: "group.admin"
	}
)

addCommand(
	'release',
	async (source, args) => {
		const player = GetPlayer(Number(args[0]))
		if (!player) return emitNet('ox_lib:notify', source, { type: 'error', title: 'No player found with that id' })
			
		const charId = player.charId
		if (!charId) throw new Error('charId was not truthy')
		if (!timeLeft[charId]) return
		
		releasePrisoner(player)
	},
	{
		help: "release a player from the prison",
		params: [
			{
				name: 'id'
			}
		],
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
	const row = await oxmysql.single<{ jailPeriod: number }>(
		'SELECT jailPeriod FROM lenix WHERE charId = ?',
		[player.charId]
	)
	if (!row || row.jailPeriod <= 0) return
	handles[player.charId] = imprisonPlayer(player, row.jailPeriod)
});

on('ox:playerLogout', async (playerId: number) => {
	const player = GetPlayer(playerId)
	if (!player?.charId) return
	if (!timeLeft[player.charId]) return
	await oxmysql.update(
		`INSERT INTO lenix (charId, jailPeriod)
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE
				jailPeriod = VALUES(jailPeriod)`,
		[player.charId, timeLeft[player.charId]]
	)
	const singleHandles = handles[player.charId]
	if (!singleHandles) return
	clearTimeout(singleHandles.timeout)
	clearInterval(singleHandles.interval)
	delete handles[player.charId]
	delete timeLeft[player.charId]
});