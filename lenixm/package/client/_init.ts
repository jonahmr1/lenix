import { asserts, type JsonValue } from '@lenix/lenix'
import type { Request } from '../shared/types.ts'
import { state, onNui } from './nui.ts'

type Resolve = {
	success: true,
	returned: JsonValue
} | {
	success: false
}

const DEFAULT_TIMEOUT = 5000
const pendingResolves: Record<number, (resolve: Resolve) => void> = {}
const requests: string[] = []
let requestId = 0

onNui<Request<JsonValue, '__nuiServer', {
	id: string
	data: {
		requestData: JsonValue
		timeout?: number
	}
}>>('__nuiServer', async ({ id, data }) => {
	const { timeout = DEFAULT_TIMEOUT, requestData } = data

	const response = await new Promise<Resolve>(resolve => {
		requestId = requestId + 1
		const currentRequestId = requestId
		pendingResolves[currentRequestId] = resolve

		if (!requests.includes(id)) {
			requests.push(id)
			onNet(`lenix/nui:${id}`, (selfrequestId: number, response: JsonValue) => {
				if (!pendingResolves[selfrequestId]) return

				pendingResolves[selfrequestId]({ success: true, returned: response })
				delete pendingResolves[selfrequestId]
			})
		}

		emitNet(`lenix/nui:${id}`, currentRequestId, requestData)

		setTimeout(() => {
			if (pendingResolves[currentRequestId]) {
				pendingResolves[currentRequestId]({ success: false })
				delete pendingResolves[currentRequestId]
			}
		}, timeout)
	})

	asserts(response.success, `server nui<${id}> timed out after ${timeout}ms, possible slow respose or request does not exist`)

	return response.returned
})

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

onNui<Request<null, '__nuiInit'>>('__nuiInit', () => {
	state.nuiReady = true
	return null
})
