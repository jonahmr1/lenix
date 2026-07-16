import type { _InternalRequests } from '../types/index.ts'
import { triggerNui } from './trigger.ts'

/**
 * Requests keyboard and cursor focus for the NUI browser.
 */
export const focus = (
	keyboard = true,
	cursor = true
): Promise<true> => triggerNui<_InternalRequests['focus']>('__nuiFocus', { keyboard, cursor })
