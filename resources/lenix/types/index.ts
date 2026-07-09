type AtLeastOne<T> = {
	[K in keyof T]-?: { [P in K]: T[P] } & Partial<Omit<T, K>>
}[keyof T];

type PartialExcept<T, K extends keyof T> = {
	[P in K]: T[P];
} & AtLeastOne<Omit<T, K>>;

export type Vector3 = [number, number, number]
export type Vector4 = [number, number, number, number]

export type Event<Id extends string, Params extends unknown[] = never> = [Id, Params]

export type Request<Response, Id extends string, Params extends object = {}> =
	Params extends readonly unknown[]
	? never
	: [Response, Id, Params];


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
	playerId: Officer['playerId'];
} & OfficerUpdates;

export interface Events {
	displayRadio: Event<'radio:display', [boolean]>
	displayRoster: Event<'roster:display', [boolean, number]>
	displayHud: Event<'hud:display', [boolean]>
	updateHudClip: Event<'hud:update:clip', [string]>
	updateHudReserve: Event<'hud:update:reserve', [string]>
	addOfficer: Event<'roster:addOfficer', [Officer]>
	refreshOfficers: Event<'roster:refreshOfficers', [Officers]>
}

export interface Requests {
	changeFrequency: Request<true, 'radio:frequency', { frequency: string }>
	closeRadio: Request<true, 'radio:close'>
	leaveRadio: Request<true, 'radio:leave'>
	updateOfficer: Request<true, 'roster:updateOfficer', PartialOfficer>
	loseFocus: Request<true, 'roster:lostFocus'>
	triggerCallsign: Request<true, 'roster:callsign'>
}
