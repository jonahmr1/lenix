export default null

export interface CreateSinglePed {
  hash: number,
  coords: number[]
  scenario?: {
    name: string,
    timeToLeave: number,
    playIntroClip: boolean
  },
  behavior?: {
    freeze?: boolean,
    oblivious?: boolean,
  }
}

export interface CreateSingleVehicle {
	hash: number
	coords: number[]
	preCreate?: boolean
	plate?: string
	giveKey?: boolean
	fuelAmount?: number
	register?: boolean
	engine?: {
		instantly: boolean
		disableAutoStart: boolean
	}
	warp?: {
		netId: number
		seat: number
	}
	customize?: [
		number,
		number,
		number,
		{ livery?: number },
	]
}

export interface CreateCamSettings {
  coords: number[],
  rotation: {
    vertical: number,
    horizontal: number
  },
  details?: {
    fov?: number, 
    fadeOut?: number,
    fadeIn?: number,
    delay?: number,
    rotationOrder?: number,
  }
}

export interface DestroyCamSettings {
  handle: number,
  details?: {
    fadeOut?: number,
    fadeIn?: number,
    delay?: number
  }
}

