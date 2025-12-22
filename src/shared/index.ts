export default null

export interface CreateSinglePed {
  hash: number,
  coords: [number, number, number, number]
  scenario?: {
    name: string,
    freeze: boolean,
    oblivious: boolean,
    timeToLeave: number,
    playIntroClip: boolean
  },
}

export interface CreateSingleVehicle {
	hash: number
	preCreate: boolean
	plate: string
	giveKey: boolean
	fuelAmount: number
	register: boolean
	coords: [number, number, number, number]
	engine: {
		instantly: boolean
		disableAutoStart: boolean
	}
	warp: {
		netId: number
		seat: number
	}
	customize: [
		number,
		number,
		number,
		{ livery: number },
	]
}

export interface CreateCamSettings {
  coords: [number, number, number, number],
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

