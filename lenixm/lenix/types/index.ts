import type { OxAccountRole } from '@overextended/ox_core'
import type { Vec3, Vec4, Event, Request } from 'lenix'

// type PartialExcept<T, K extends keyof T> = {
// 	[P in K]: T[P];
// } & AtLeastOne<Omit<T, K>>;

export type Vector3 = Vec3
export type Vector4 = Vec4

export interface Events {
	displayRadio: Event<'radio:display', [true]>
}

export interface Requests {
	changeFrequency: Request<boolean, 'radio:frequency', { frequency: string }>
	closeRadio: Request<null, 'radio:close'>
	leaveRadio: Request<null, 'radio:leave'>
}

export type SyncConfig = 'irl' | 'custom' | 'server'

export interface PlayerStorage {
	invNotifications: boolean
	weatherFreeze: boolean
	timeFreeze: boolean
	weatherSync: Exclude<SyncConfig, 'irl'>
	timeSync: SyncConfig
	timeValue: number
	weatherType:
		| 'CLEAR'
		| 'EXTRASUNNY'
		| 'CLOUDS'
		| 'OVERCAST'
		| 'RAIN'
		| 'CLEARING'
		| 'THUNDER'
		| 'SMOG'
		| 'FOGGY'
		| 'XMAS'
		| 'SNOW'
		| 'SNOWLIGHT'
		| 'BLIZZARD'
		| 'HALLOWEEN'
		| 'NEUTRAL'
		| 'RAIN_HALLOWEEN'
		| 'SNOW_HALLOWEEN'
}

export interface CreateGroup {
	name: string
	label: string
	hasAccount: string
	grades: {
		label: string
		accountRole: OxAccountRole
	}[]
}