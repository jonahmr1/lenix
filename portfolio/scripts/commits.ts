import { octokit, ownerRepos, VALID_NAMES } from './client'

// eslint-disable-next-line max-statements
const repoDates = async (owner: string, repo: string) => {
	const dates: string[] = []
	const yearBehind = new Date()
	yearBehind.setFullYear(yearBehind.getFullYear() - 1)
	const pages = octokit.paginate.iterator(octokit.rest.repos.listCommits, {
		owner,
		repo,
		per_page: 100,
	})
	for await (const { data } of pages) {
		let done = false
		for (const {
			commit: { author },
		} of data)
			if (typeof author?.date === 'string') {
				if (new Date(author.date) < yearBehind) {
					done = true
					break
				}
				if (VALID_NAMES.includes(author.name ?? ''))
					dates.push(
						new Date(author.date).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
						}),
					)
			}
		if (done) break
	}
	return dates
}

export const totalCommits = async () => {
	const dates: string[] = []
	for (const { owner, name } of ownerRepos)
		dates.push(...(await repoDates(owner.login, name)))
	return dates
}
