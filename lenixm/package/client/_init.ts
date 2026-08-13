import type { Request } from '../shared/types.ts'
import { onNui } from './nui.ts'

onNui<Request<true, '__nuiFocus', {
	keyboard: boolean,
	cursor: boolean
}>>('__nuiFocus', ({
	keyboard,
	cursor
}) => {
	SetNuiFocus(keyboard, cursor)
	return true
})
