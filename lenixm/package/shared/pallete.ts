const colorCodes = {
	red: '1',
	green: '2',
	yellow: '3',
	blue: '4',
	cyan: '5',
	pink: '6',
	wine: '8',
	navy: '9',
} as const

export const pallete = (color: keyof typeof colorCodes, text: string) => `^${colorCodes[color]}${text}^7` as const
