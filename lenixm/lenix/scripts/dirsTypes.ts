import { readdirSync, writeFileSync } from "fs"

function folders(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.map(entry => entry.name)
		.sort()
}

function union(names: string[]): string {
	return names.map(name => `'${name}'`).join(' | ') || 'never'
}

export function genDirsTypes() {
	const client = folders('resource/client')
	const server = folders('resource/server')

	writeFileSync(
		'types/dirs.d.ts',
		[
			'/* auto-generated */',
			'',
			`export type ClientScript = ${union(client)}`,
			`export type ServerScript = ${union(server)}`,
			'',
		].join('\n'),
		'utf8',
	)
}