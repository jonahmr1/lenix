// deno-lint-ignore-file no-undef

import type { Vec4 } from '../index.ts'

export interface BaseCamDetails {
	fadeOut?: number,
	fadeIn?: number,
	delay?: number
}

export interface CreateCamSettings {
  coords: Vec4,
  rotation: {
    vertical: number,
    horizontal: number
  },
  details?: {
    fov?: number, 
    rotationOrder?: number,
  } & BaseCamDetails
}

export interface DestroyCamSettings {
  cam: number,
  details?: BaseCamDetails
}

const toggleCam = ({
	cam,
	state,
	delay,
	fadeIn,
	fadeOut
}: {
	cam: number
	state: boolean
	delay: number
	fadeIn: number
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
  const cam = CreateCamWithParams(
		"DEFAULT_SCRIPTED_CAMERA",
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