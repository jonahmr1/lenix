export type Vector3 = [number, number, number]
export type Vector4 = [number, number, number, number]

export type DutyState = 'on' | 'off' | 'break'
export type TalkState = 'on' | 'off'

export interface Officer {
	charId: number
	unit: string
	name: string
	duty_state: DutyState
	talk_state: TalkState
}