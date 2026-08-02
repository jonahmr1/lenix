export interface AppData {
	loc: { added: number; deleted: number }
	commits: string[]
	langsBytes: { name: string; bytes: number }[]
}

export const fetchAppData = async (): Promise<AppData> => {
	const res = await fetch(
		`https://api.github.com/gists/8a81298c8173af0f2bff75bba7f37c68`,
	)
	if (!res.ok) throw new Error(`Gist fetch failed: ${res.status}`)

	const gist = (await res.json()) as {
		files: { 'data.json': { content: string } }
	}
	return JSON.parse(gist.files['data.json'].content) as AppData
}
