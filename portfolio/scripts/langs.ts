import { octokit, ownerRepos, VALID_NAMES } from './client'

type Languages = { name: string; bytes: number }[]

export const totalLangsBytes = async () => {
	const result: Languages = []
	for (const {
		fork,
		name,
		owner: { login: owner },
	} of ownerRepos)
		if (!fork && VALID_NAMES.includes(owner)) {
			const { data: langs } = await octokit.rest.repos.listLanguages({
				owner,
				repo: name,
			})
			for (const [lang, bytes] of Object.entries(langs))
				result.push({ name: lang, bytes })
		}
	const merged = new Map<string, number>()
	for (const { name, bytes } of result)
		merged.set(name, (merged.get(name) ?? 0) + bytes)
	return Array.from(merged, ([name, bytes]) => ({ name, bytes })).sort(
		(a, b) => b.bytes - a.bytes,
	)
}
