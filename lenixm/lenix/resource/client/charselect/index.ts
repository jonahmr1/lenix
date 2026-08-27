import { asserts } from '@lenix/lenix'
import type { Character } from '@overextended/ox_core'
import {
	cache,
	checkDependency,
	locale,
	registerContext,
	requestModel,
	showContext,
	triggerServerCallback,
} from '@overextended/ox_lib/client'
import type { Vec3 } from 'lenix'
import { api } from 'lenix/client'

checkDependency('ox_core', '1.5.14', true)
checkDependency('ox_lib', '3.39.0', true)

const CHARACTER_SLOTS = 2
const pedsCoords: [number, number, number, number][] = [
	[-2167.1487, 1134.3087, -25.3712, 272.6151],
	[-2167.1431, 1137.5076, -25.3712, 269.0276],
]
const hiddenCoords = [-2154.6487, 1135.6996, -24.3712] as const
const camCoords = [-2156.2529, 1136.0225, -23.3712, 89.9823] as const
const charactersFocusOffset = [99, 79] as const

asserts(
	pedsCoords.length === CHARACTER_SLOTS,
	`Please match the CHARACTER_SLOTS<${CHARACTER_SLOTS}> with you pedCoords length<${pedsCoords.length}>`,
)

const getCursorRay = (cam: number): [[number, number, number], [number, number, number]] => {
	const [cursorX, cursorY] = GetNuiCursorPosition()
	const [resX, resY] = GetActiveScreenResolution()
	const screenX = cursorX / resX
	const screenY = cursorY / resY
	const camPos = GetCamCoord(cam) as Vec3
	const [worldPos, normal] = GetWorldCoordFromScreenCoord(screenX, screenY) as [Vec3, Vec3]

	return [camPos, [worldPos[0] + normal[0] * 50, worldPos[1] + normal[1] * 50, worldPos[2] + normal[2] * 50]]
}

const charSelect = async (characters: Character[]): Promise<Character | undefined> => {
	if (!characters.length) return

	const peds: number[] = []
	const cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)
	let activeCam = cam
	let camTransition = 0
	let isZoomingIn = false
	const rotateCamSmooth = (heading: number, fov: number, zoomingIn = false) => {
		const nextCam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)
		const transition = ++camTransition
		isZoomingIn = zoomingIn

		SetCamCoord(nextCam, camCoords[0], camCoords[1], camCoords[2])
		SetCamRot(nextCam, -5.0, 0.0, heading, 2)
		SetCamFov(nextCam, fov)
		SetCamActiveWithInterp(nextCam, activeCam, 500, 1, 1)

		const oldCam = activeCam
		activeCam = nextCam

		setTimeout(() => {
			DestroyCam(oldCam, false)
			if (transition === camTransition && zoomingIn) isZoomingIn = false
		}, 500)
	}

	for (const [index, coords] of pedsCoords.entries()) {
		const character = characters[index]
		const hash = await requestModel('mp_m_freemode_01')
		const ped = CreatePed(4, hash, coords[0], coords[1], coords[2], coords[3], false, false)

		if (character) {
			const appearance = await triggerServerCallback('lenix:server:appearance:getappearance', null, character.charId)
			if (!appearance) console.error(`Failed to get character<${character.charId}> appearance`)
			api['illenium-appearance']?.setPedAppearance?.(ped, appearance)
		}

		if (!character) SetEntityAlpha(ped, 51 * 4, false)
		SetModelAsNoLongerNeeded(hash)
		FreezeEntityPosition(ped, true)
		SetEntityInvincible(ped, true)
		SetBlockingOfNonTemporaryEvents(ped, true)
		peds.push(ped)
	}

	SetCamCoord(cam, camCoords[0], camCoords[1], camCoords[2])
	SetCamRot(cam, -5.0, 0.0, camCoords[3], 2)
	SetCamFov(cam, 17.5)
	SetCamActive(cam, true)
	RenderScriptCams(true, false, 0, true, false)

	SetEntityCoords(cache.ped, ...hiddenCoords, false, false, false, false)

	on('onResourceStop', () => {
		peds.forEach(ped => {
			DeletePed(ped)
		})
	})

	DoScreenFadeIn(1000)
	return await new Promise(result => {
		let hoveredIndex = -1
		let hoverOutArmed = false
		let lastCursorX = -1
		let lastCursorY = -1

		const tick = setTick(() => {
			SetMouseCursorActiveThisFrame()
			SetMouseCursorSprite(1)
			DisableAllControlActions(0)
			EnableControlAction(0, 24, true)
			EnableControlAction(0, 25, true)

			const [cursorX, cursorY] = GetNuiCursorPosition()
			const cursorMoved = cursorX !== lastCursorX || cursorY !== lastCursorY
			lastCursorX = cursorX
			lastCursorY = cursorY

			const [camPos, farPoint] = getCursorRay(activeCam)
			const ray = StartShapeTestRay(
				camPos[0],
				camPos[1],
				camPos[2],
				farPoint[0],
				farPoint[1],
				farPoint[2],
				12,
				cache.ped,
				0,
			)
			const [, hit, , , entity] = GetShapeTestResult(ray)

			const index = hit ? peds.indexOf(entity) : -1

			if (cursorMoved && !isZoomingIn) {
				if (hoveredIndex === -1) {
					if (index === -1) return
					hoveredIndex = index
					hoverOutArmed = false
					const offset = charactersFocusOffset[hoveredIndex]
					asserts(offset)
					rotateCamSmooth(offset, 10, true)
				} else if (index === hoveredIndex) {
					hoverOutArmed = true
				} else if (index === -1) {
					if (!isZoomingIn && hoverOutArmed) {
						hoveredIndex = -1
						hoverOutArmed = false
						rotateCamSmooth(camCoords[3], 17.5)
					}
				} else {
					hoveredIndex = index
					hoverOutArmed = false
					const offset = charactersFocusOffset[hoveredIndex]
					asserts(offset)
					rotateCamSmooth(offset, 10, true)
				}
			}

			if (!IsDisabledControlJustPressed(0, 24)) return
			if (index === -1) return

			RenderScriptCams(false, false, 0, true, false)
			DestroyCam(activeCam, false)
			clearTick(tick)
			SetNuiFocus(false, false)
			SetNuiFocusKeepInput(false)
			DoScreenFadeOut(100)
			peds.forEach(ped => {
				DeletePed(ped)
			})
			result(characters[index])
		})
	})
}

const promptCharacterMenu = async (characters: Character[]): Promise<Character | undefined> =>
	new Promise(resolve => {
		registerContext({
			id: 'char_selection',
			title: 'Character Selection',
			canClose: false,
			options: [
				...characters.map(character => ({
					title: `${character.firstName} ${character.lastName}`,
					metadata: [
						{ label: locale('gender'), value: locale(character.gender as any) },
						{ label: locale('last_played'), value: character.lastPlayed },
					],
					onSelect: () => resolve(character),
				})),
				{
					title: locale('create_character'),
					disabled: characters.length >= CHARACTER_SLOTS,
					onSelect: () => resolve(undefined),
				},
			],
		})

		showContext('char_selection')
	})

globalThis.exports('charselect', async (characters: Character[], variant: 'menu' | 'native'): Promise<Character | undefined> => {
	switch (variant) {
		case 'menu': return await promptCharacterMenu(characters)
		case 'native': return await charSelect(characters)
		default: throw `Unknown charselection variant<${variant}>`
	}
})
