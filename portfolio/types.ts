import type { AppData } from './lib/data'

export type DataContextValue =
	| { status: 'loading' }
	| { status: 'error'; error: string }
	| { status: 'ok'; data: AppData }

// Timeline
import type { ReactNode } from 'react'

export type TimelineSize = 'sm' | 'md' | 'lg'
export type TimelineStatus = 'completed' | 'in-progress' | 'pending'
export type TimelineColor =
	| 'primary'
	| 'secondary'
	| 'muted'
	| 'accent'
	| 'destructive'
	| 'success'
	| 'pending'
	| 'paused'

export interface TimelineElement {
	id: number
	date: string
	title: string
	description: string
	techs?: string[]
	icon?: ReactNode | (() => ReactNode)
	status?: TimelineStatus
	color?: TimelineColor
	size?: TimelineSize
	loading?: boolean
	error?: string
	iconHover?: string
	url?: string
}
