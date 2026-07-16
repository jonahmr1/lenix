// deno-lint-ignore-file no-undef

import type { Vec4 } from '../index.ts'

/**
 * Screen fade settings used when toggling a scripted camera.
 */
export interface BaseCamDetails {
	/**
	 * Fade-out duration in milliseconds.
	 */
	fadeOut?: number
	/**
	 * Fade-in duration in milliseconds.
	 */
	fadeIn?: number
	/**
	 * Delay before the camera state changes.
	 */
	delay?: number
}

/**
 * Settings used to create and activate a scripted camera.
 */
export interface CreateCamSettings {
	/**
	 * Camera coordinates and heading.
	 */
	coords: Vec4
	/**
	 * Camera vertical and horizontal rotation.
	 */
	rotation: {
		vertical: number,
		horizontal: number
	}
	/**
	 * Optional camera field-of-view, rotation order, and fade settings.
	 */
	details?: {
		fov?: number,
		rotationOrder?: number
	} & BaseCamDetails
}

/**
 * Settings used to deactivate a scripted camera.
 */
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
		// deno-lint-ignore no-boolean-literal-for-arguments
		RenderScriptCams(state, state, delay, true, state)
		DoScreenFadeIn(fadeIn)
	}, delay)
	DoScreenFadeOut(fadeOut)
}

const create = ({
	coords,
	rotation: {
		vertical,
		horizontal
	},
	details
}: CreateCamSettings): number => {
	const fov = details?.fov ?? 40.0,
		fadeOut = details?.fadeOut ?? 0,
		fadeIn = details?.fadeIn ?? 0,
		delay = details?.delay ?? 0,
		rotationOrder = details?.rotationOrder ?? 0

	DoScreenFadeOut(fadeOut)
	// deno-lint-ignore no-boolean-literal-for-arguments
	const cam = CreateCamWithParams(
		'DEFAULT_SCRIPTED_CAMERA',
		coords[0],
		coords[1],
		coords[2],
		vertical,
		horizontal,
		coords[3],
		fov,
		false,
		rotationOrder
	)

	toggleCam({
		cam,
		state: true,
		delay,
		fadeIn,
		fadeOut
	})

	return cam
}

const destroy = ({
	cam,
	details
}: DestroyCamSettings): void => {
	const fadeOut = details?.fadeOut ?? 0,
		fadeIn = details?.fadeIn ?? 0,
		delay = details?.delay ?? 0

	toggleCam({
		cam,
		state: false,
		delay,
		fadeIn,
		fadeOut
	})
}

// TODO: delete cams on resource stop

export const cam = {
	create,
	destroy
}
