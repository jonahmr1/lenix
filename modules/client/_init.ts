// deno-lint-ignore-file no-undef
import type { _InternalRequests } from '../shared/types.ts'
import { onNui } from './nui.ts'

onNui<_InternalRequests['focus']>('__nuiFocus', ({
	keyboard,
	cursor
}) => {
	SetNuiFocus(keyboard, cursor)
	return true
})
