import type { _InternalRequests } from '../types/index.ts'
import { triggerNui } from './trigger.ts'

export const focus = (
	keyboard = true,
	cursor = true
): Promise<true> => triggerNui<_InternalRequests['focus']>('__nuiFocus', { keyboard, cursor })