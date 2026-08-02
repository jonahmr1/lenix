import type { AppData } from './data'

export const commitsToChartData = (commits: string[]) => {
	const grouped = new Map<string, number>()
	for (const date of commits) grouped.set(date, (grouped.get(date) ?? 0) + 1)
	return [...grouped.entries()]
		.sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
		.map(([date, count]) => ({ date, count }))
}

export const filterLangs = (langsBytes: AppData['langsBytes']) => {
	const filtered = langsBytes
	const total = filtered.reduce((acc, lang) => acc + lang.bytes, 0)
	return { filtered, total }
}

export const fade = (delay = 0) => ({
	initial: { opacity: 0, y: 16 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.5, delay },
})
