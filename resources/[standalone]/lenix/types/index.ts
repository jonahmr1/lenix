export type Vector3 = [number, number, number]
export type Vector4 = [number, number, number, number]

export type Callback<Id extends string, Params = unknown[]> = [Id, Params];

export type DutyState = 'on' | 'off' | 'break'
export type TalkState = 'on' | 'off'

export interface Officer {
	charId: number
	unit: string
	name: string
	duty_state: DutyState
	talk_state: TalkState
}


export interface Callbacks {
  displayRadio: ['radio:display', [boolean]]
  displayRoster: ['roster:display', [boolean]]
  displayHud: ['hud:display', [boolean]]
  updateHudClip: ['hud:update:clip', [string]]
  updateHudReserve: ['hud:update:reserve', [string]]
};