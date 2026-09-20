import 'server-only'

import { asserts, raise, waste } from '@lenix/lenix'
import { Octokit } from 'octokit'
import { CURRENT_USERNAME } from './utils'

const octokit = new Octokit({ auth: process.env.GH_TOKEN })

const VALID_NAMES = [
	'Lenix',
	'lenixdev',
	'LenixDev',
	'Lenixx',
	'tripplerscripts',
	'lenix',

	'TripplerScripts',
	CURRENT_USERNAME,
]

asserts(process.env.GH_TOKEN?.length, 'GH_TOKEN missing')

export const fetchGithubStats = async () => {
	const commits: string[] = []
	let langs: {
		name: string
		bytes: number
	}[] = []
	const lines = { added: 0, deleted: 0 }

	console.debug('new fetch started')

	try {
		const ownerRepos = await octokit.paginate(
			octokit.rest.repos.listForAuthenticatedUser,
			{ per_page: 100, type: 'all' },
		)
		console.debug('getting commits...')

		/* getCommits */
		for (const { owner, name } of ownerRepos) {
			const selfDates: string[] = []
			const yearBehind = new Date()
			yearBehind.setFullYear(yearBehind.getFullYear() - 1)

			const pages = octokit.paginate.iterator(octokit.rest.repos.listCommits, {
				owner: owner.login,
				repo: name,
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
							selfDates.push(
								new Date(author.date).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric',
								}),
							)
					}
				if (done) break
			}

			commits.push(...selfDates)
		}
		console.debug('done getting commits!')
		
		console.debug('moving to getting langs!')
		/* getLangs */
		const result: { name: string; bytes: number }[] = []
		const merged = new Map<string, number>()

		for (const {
			fork,
			name,
			owner: { login: owner },
		} of ownerRepos) {
			if (!fork && VALID_NAMES.includes(owner)) {
				const { data: langs } = await octokit.rest.repos.listLanguages({
					owner,
					repo: name,
				})
				for (const [lang, bytes] of Object.entries(langs)) result.push({ name: lang, bytes })
			}
		}
		for (const { name, bytes } of result) merged.set(name, (merged.get(name) ?? 0) + bytes)

		langs = Array.from(merged, ([name, bytes]) => ({ name, bytes })).sort(
			(a, b) => b.bytes - a.bytes,
		)
		console.debug('done getting langs!')
		console.debug('moving to getting lines!')

		/* getLines */
		const targets = ownerRepos.filter(({ owner }) => VALID_NAMES.includes(owner.login))

		for (const { owner: { login: owner }, name: repo } of targets) {
			const { data, status } = await octokit.rest.repos.getContributorsStats({ owner, repo })
			if (status === 202) {
				console.warn(`github has an error with: ${owner}/${repo}, falling back...`)

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

						await waste(100)
					}
				}
				lines.added += added
				lines.deleted += deleted
				continue
			}

			for (const contributor of Array.isArray(data) ? data : []) {
				if (contributor.author?.login !== 'jonahmr1') continue
				for (const week of contributor.weeks) {
					lines.added += week.a ?? 0
					lines.deleted += week.d ?? 0
				}
			}
		}
	} catch (err) {
		raise(err)
	}
	console.debug('fetch done!')
	console.log({ lines, commits, langs })

	return { lines, commits, langs }
}
