export type Vector3 = [number, number, number]
export type Vector4 = [number, number, number, number]

export type Event<Id extends string, Params extends unknown[] = never> = [Id, Params];
export type Request<Id extends string, Params extends Record<string, unknown> = {}> = [Id, Params];

export type DutyState = 'on' | 'off' | 'break'
export type TalkState = 'on' | 'off'

export interface Officer {
	charId: number
	unit: string
	name: string
	duty_state: DutyState
	talk_state: TalkState
}

export interface Events {
	displayRadio: Event<'radio:display', [boolean]>
	displayRoster: Event<'roster:display', [boolean]>
	displayHud: Event<'hud:display', [boolean]>
	updateHudClip: Event<'hud:update:clip', [string]>
	updateHudReserve: Event<'hud:update:reserve', [string]>
};

export interface Requests {
	changeFrequency: Request<'radio:frequency', { frequency: string }>
	closeRadio: Request<'radio:close'>
	leaveRadio: Request<'radio:leave'>
}