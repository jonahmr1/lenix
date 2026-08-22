import { cache, checkDependency } from '@overextended/ox_lib/client'
import { control, pool } from 'lenix/client'
import type { Vector3 } from 'types'

checkDependency('ox_lib', '3.39.0', true)

let shown = false

control.on({
	event: 'press',
	key: 'HOME',
	onEvent: () => !shown,
})
control.on({
	event: 'released',
	key: 'HOME',
	onEvent: () => !shown,
})

// From https://github.com/Qbox-project/qbx_core/blob/main/modules/lib.lua#L441
const drawText3D = ({
	text,
	coords,
	scale = 0.75,
	font = 4,
	color = [255, 255, 255, 255],
	enableDropShadow = true,
	enableOutline = true,
}: {
	text: string
	coords: Vector3
	scale?: number | [number, number]
	font?: number
	color?: [number, number, number, number]
	enableDropShadow?: boolean
	enableOutline?: boolean
	disableDrawRect?: boolean
}) => {
	const [sx, sy] = typeof scale === 'number' ? [scale, scale] : scale

	SetTextScale(sx, sy)
	SetTextFont(font)
	SetTextColour(...color)

	if (enableDropShadow) SetTextDropShadow()
	if (enableOutline) SetTextOutline()

	SetTextCentre(true)
	BeginTextCommandDisplayText('STRING')
	AddTextComponentSubstringPlayerName(text)

	SetDrawOrigin(coords[0], coords[1], coords[2], 0)
	EndTextCommandDisplayText(0.0, 0.0)

	ClearDrawOrigin()
}

const displayIdentities = () => {
	if (!shown) return
	const players = GetActivePlayers()

	for (const player of players) {
		const ped = GetPlayerPed(player)

		const coords = GetEntityCoords(ped, false) as Vector3
		const myCoords = GetEntityCoords(cache.ped, false) as Vector3

		const distance = GetDistanceBetweenCoords(
			myCoords[0],
			myCoords[1],
			myCoords[2],
			coords[0],
			coords[1],
			coords[2],
			true,
		)

		if (distance > 10.0) continue

		const serverId = GetPlayerServerId(player)

		drawText3D({
			text: String(serverId),
			coords: [coords[0], coords[1], coords[2] + 1.0],
		})
	}
}

pool(() => {
	displayIdentities()
})
