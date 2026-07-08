import { GetPlayer, type OxPlayer } from '@overextended/ox_core/server'
import { addCommand, triggerClientCallback } from '@overextended/ox_lib/server'
import { oxmysql } from '@overextended/oxmysql'
import { INSIDE, OUTSIDE } from 'common/prison';

type JailHandles = { timeout: CitizenTimer; interval: CitizenTimer }

const timeLeft: Record<string, number> = {}
const handles: Record<string, JailHandles> = {}

const imprisonPlayer = (player: OxPlayer, period: number): JailHandles => {
	const charId = player.charId
	if (!charId) throw new Error('charId was not truthy')
		
	SetEntityCoords(player.ped, ...INSIDE, false, false, false, false)

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

	SetEntityCoords(player.ped, OUTSIDE[0], OUTSIDE[1], OUTSIDE[2], false, false, false, false)
	SetEntityHeading(player.ped, OUTSIDE[3])
	await oxmysql.update(
		`INSERT INTO lenix (charId, jail_period)
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE
			jail_period = VALUES(jail_period)`,
		[player.charId, 0],
	)
	clearTimeout(singleHandles.timeout)
	clearInterval(singleHandles.interval)
	delete handles[player.charId]
	delete timeLeft[player.charId]
}

addCommand(
	'jail',
	async source => {
		const res = await triggerClientCallback<{
			id: string
			period: string
		}>('lenix:imprisonPlayer', source)
		if (!res) return
		const { id, period } = res

		const player = GetPlayer(id)
		if (!player) return emitNet('ox_lib:notify', source, { type: 'error', title: 'No player found with that id' })
		const charId = player.charId
		if (!charId) throw new Error('charId was not truthy')
		handles[charId] = imprisonPlayer(player, Number(period))
	},
	{
		help: 'Imprison a player',
		restricted: 'group.admin',
	},
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
		help: 'release a player from the prison',
		params: [
			{
				name: 'id',
			},
		],
		restricted: 'group.admin',
	},
)

onNet('lenix:server:prison:teleport', () => {
	const player = GetPlayer(source)
	if (!player?.charId) return
	if (!timeLeft[player.charId] || timeLeft[player.charId] !== 0) return
	
	SetEntityCoords(player.ped, ...INSIDE, false, false, false, false)
})

on('ox:playerLoaded', async (playerId: number) => {
	const player = GetPlayer(playerId)
	if (!player?.charId) return
	const row = await oxmysql.single<{ jail_period: number }>('SELECT jail_period FROM lenix WHERE charId = ?', [
		player.charId,
	])
	if (!row || row.jail_period <= 0) return
	handles[player.charId] = imprisonPlayer(player, row.jail_period)
})

on('ox:playerLogout', async (playerId: number) => {
	const player = GetPlayer(playerId)
	if (!player?.charId) return
	if (!timeLeft[player.charId]) return
	await oxmysql.update(
		`INSERT INTO lenix (charId, jail_period)
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE
				jail_period = VALUES(jail_period)`,
		[player.charId, timeLeft[player.charId]],
	)
	const singleHandles = handles[player.charId]
	if (!singleHandles) return
	clearTimeout(singleHandles.timeout)
	clearInterval(singleHandles.interval)
	delete handles[player.charId]
	delete timeLeft[player.charId]
})
