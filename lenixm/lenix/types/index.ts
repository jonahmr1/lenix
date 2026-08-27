import type { OxAccountRole } from '@overextended/ox_core'
import type { Vec3, Vec4, Event, Request } from 'lenix'

type AtLeastOne<T> = {
	[K in keyof T]-?: { [P in K]: T[P] } & Partial<Omit<T, K>>
}[keyof T]

// type PartialExcept<T, K extends keyof T> = {
// 	[P in K]: T[P];
// } & AtLeastOne<Omit<T, K>>;

export type Vector3 = Vec3
export type Vector4 = Vec4

export type DutyState = 'on' | 'off' | 'break'
export type TalkState = 'on' | 'off'

export interface Officer {
	playerId: number
	callsign: string
	name: string
	duty_state: DutyState
	talk_state: TalkState
}

export type Officers = Record<number, Officer>

export type OfficerUpdates = AtLeastOne<Omit<Officer, 'playerId'>>

export type PartialOfficer = {
	playerId: Officer['playerId']
} & OfficerUpdates

export interface Events {
	displayRadio: Event<'radio:display', [true]>
	displayRoster: Event<'roster:display', [number]>
	displayHud: Event<'hud:display', [boolean]>
	updateHudClip: Event<'hud:update:clip', [string]>
	updateHudReserve: Event<'hud:update:reserve', [string]>
	addOfficer: Event<'roster:addOfficer', [Officer]>
	refreshOfficers: Event<'roster:refreshOfficers', [Officers]>
	updateTopscoreData: Event<'topscore:updateData', [TopscoreData]>
}

export interface Requests {
	changeFrequency: Request<boolean, 'radio:frequency', { frequency: string }>
	closeRadio: Request<null, 'radio:close'>
	leaveRadio: Request<null, 'radio:leave'>
	updateOfficer: Request<null, 'roster:updateOfficer', PartialOfficer>
	triggerCallsign: Request<null, 'roster:callsign'>
}

export interface Team {
	leader: number
	members: number[]
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

export type TopscoreData = Record<
	1 | 2 | 3,
	{
		scale: number
		bottom: number
		left: number
		visible: boolean
		name: string
		avatar: string
		stats: {
			kills: number
			deaths: number
			wins: number
			kd: number
		}
	}
>

export type TopscoreContextData = Record<1 | 2 | 3, Omit<TopscoreData[1], 'scale' | 'bottom' | 'left' | 'visible'>>

export interface CriminialApi {
	success: boolean
	error?: string
	item?: string
	amount?: number
	response?: string
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