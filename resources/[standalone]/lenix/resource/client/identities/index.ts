import { addKeybind, cache } from "@overextended/ox_lib/client";
import type { Vector3 } from "types";

let shown = false

addKeybind({
	name: 'identities',
	description: 'Show players identities',
	defaultKey: 'HOME',
	onPressed: () => {
		shown = true
	},
	onReleased: () => {
		shown = false
	}
})

interface DrawText3DOptions {
	text: string
	coords: Vector3
	scale?: number | [number, number]
	font?: number
	color?: [number, number, number, number]
	enableDropShadow?: boolean
	enableOutline?: boolean
	disableDrawRect?: boolean
}

export const drawText3D = ({
	text,
	coords,
	scale = 0.75,
	font = 4,
	color = [255, 255, 255, 255],
	enableDropShadow = true,
	enableOutline = true,
}: DrawText3DOptions) => {
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

export const displayIdentities = () => {
	if (!shown) return
	const players = GetActivePlayers()

	for (const player of players) {
		const ped = GetPlayerPed(player)

		const coords = GetEntityCoords(ped, false) as Vector3
		const myCoords = GetEntityCoords(cache.ped, false) as Vector3

		const distance = GetDistanceBetweenCoords(
			myCoords[0], myCoords[1], myCoords[2],
			coords[0], coords[1], coords[2],
			true
		)

		if (distance > 10.0) continue

		const serverId = GetPlayerServerId(player)

		drawText3D({
			text: String(serverId),
			coords: [coords[0], coords[1], coords[2] + 1.0],
		})
	}
}