import type { JsonValue } from '../types/index.ts'

type State = Record<string, JsonValue>

class StateImpl {
	constructor(initial: State) {
		return new Proxy(initial, {} satisfies State)
	}
}

export const State = StateImpl as new <T extends State>(initial: T) => T