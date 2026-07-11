import { raise, wait } from 'lenix'
import { octokit, ownerRepos, VALID_NAMES } from './client'

const getStats = async (owner: string, repo: string) => {
	try {
		const { data, status } = await octokit.rest.repos.getContributorsStats({ owner, repo })
		if (status === 202) {
			console.warn(`github has an error with: ${owner}/${repo}, falling back...`)
			return null
		}
		return Array.isArray(data) ? data : []
	} catch (err) {
		raise(err)
	}
}

const getStatsFallback = async (owner: string, repo: string) => {
	let added = 0
	let deleted = 0
	const seenRefs = new Set<string>()

	const pages = octokit.paginate.iterator(octokit.rest.repos.listCommits, {
		owner,
		repo,
		per_page: 100,
	})

	for await (const { data } of pages) {
		for (const { sha: ref, author } of data) {
			if (author?.login !== 'jonahmr1') continue
			if (seenRefs.has(ref)) continue
			seenRefs.add(ref)

			const { data: commit } = await octokit.rest.repos.getCommit({ owner, repo, ref })
			added += commit.stats?.additions ?? 0
			deleted += commit.stats?.deletions ?? 0

			await wait(100)
		}
	}

	return { added, deleted }
}

export const totalLinesAdded = async () => {
	const total = { added: 0, deleted: 0 }
	const targets = ownerRepos.filter(({ owner }) => VALID_NAMES.includes(owner.login))

	for (const { owner, name } of targets) {
		try {
			const stats = await getStats(owner.login, name)
			if (stats) {
				for (const contributor of stats) {
					if (contributor.author?.login !== 'jonahmr1') continue
					for (const week of contributor.weeks) {
						total.added += week.a ?? 0
						total.deleted += week.d ?? 0
					}
				}
				continue
			}
			const { added, deleted } = await getStatsFallback(owner.login, name)
			total.added += added
			total.deleted += deleted
		} catch (err) {
			raise(err)
		}
	}

	return total
}