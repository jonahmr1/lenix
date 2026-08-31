import type { Vec2, Vec4 } from '../shared/types.ts'

const cams = new Set<number>()

export interface BaseCamDetails {
	/**
	 * Fade-out duration in milliseconds.
	 */
	fadeOut: number
	/**
	 * Fade-in duration in milliseconds.
	 */
	fadeIn: number
	/**
	 * Delay before the camera state changes.
	 */
	delay: number
}

export interface CreateCamSettings {
	/**
	 * Camera coordinates and heading (0 - 180)!.
	 */
	coords: Vec4
	/**
	 * Camera offset from coordinates and heading (0 - 180)!.
	 */
	offset?: Vec4
	/**
	 * Camera vertical and horizontal rotation.
	 */
	rotation?: Vec2
	/**
	 * Optional camera field-of-view, rotation order, and fade settings.
	 */
	details?: {
		fov: number,
		rotationOrder: number
	} & BaseCamDetails
}

export interface DestroyCamSettings {
	/**
	 * Camera handle to deactivate.
	 */
	cam: number
	/**
	 * Optional fade settings.
	 */
	details?: BaseCamDetails
}

const toggleCam = ({
	cam,
	state,
	delay,
	fadeIn,
	fadeOut
}: {
	cam: number,
	state: boolean,
	delay: number,
	fadeIn: number,
	fadeOut: number
}) => {
	setTimeout(() => {
		SetCamActive(cam, state)
		RenderScriptCams(state, state, delay, true, state)
		DoScreenFadeIn(fadeIn)
	}, delay)
	DoScreenFadeOut(fadeOut)
}

/**
 * Creates and activates a scripted camera.
 */
const create = ({
	coords,
	offset = [0, 0, 0, 0],
	rotation = [0, 0],
	details: {
		fov,
		fadeOut,
		fadeIn,
		delay,
		rotationOrder
	} = {
		fov: 40.0,
		fadeOut: 0,
		fadeIn: 0,
		delay: 0,
		rotationOrder: 0
	}
}: CreateCamSettings): [() => void, number] => {
	DoScreenFadeOut(fadeOut)
	const cam = CreateCamWithParams(
		'DEFAULT_SCRIPTED_CAMERA',
		coords[0] + offset[0],
		coords[1] + offset[1],
		coords[2] + offset[2],
		rotation[0],
		rotation[1],
		coords[3] + offset[3],
		fov,
		false,
		rotationOrder
	)
	cams.add(cam)

	toggleCam({
		cam,
		state: true,
		delay,
		fadeIn,
		fadeOut
	})

	return [
		() => destroy({ cam, details: { delay, fadeIn, fadeOut } }),
		cam
	]
}

/**
 * Deactivates a scripted camera.
 */
const destroy = ({
	cam,
	details: {
		fadeOut,
		fadeIn,
		delay
	} = {
		fadeOut: 0,
		fadeIn: 0,
		delay: 0
	}
}: DestroyCamSettings): void => {

	toggleCam({
		cam,
		state: false,
		delay,
		fadeIn,
		fadeOut
	})
	cams.delete(cam)
}

export const cam = {
	create,
	destroy
}

on('onResourceStop', (resource: string) => {
	if (resource !== GetCurrentResourceName()) return

	cams.forEach(cam => destroy({ cam }))
})