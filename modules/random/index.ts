export const random = (from: number, to?: number): number =>
	to === undefined
	? Math.floor(Math.random() * (from + 1))
	: Math.floor(Math.random() * (to - from + 1)) + from