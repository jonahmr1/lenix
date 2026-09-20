import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from "react"
import { cache } from "@/lib/cache"
import { connection } from "next/server"
import { LanguagesChart } from './stats.client'


const ignoredLangs = ['MDX', 'CSS']


const Languages = async () => {
	await connection()
	const states = await cache.github()

	const langs = states.langs
		.filter(lang => !ignoredLangs.includes(lang.name))
		.sort((a, b) => b.bytes - a.bytes)
		.reduce<{ name: string; bytes: number }[]>((result, lang, i) => {
			if (i < 4) result.push(lang)
			else if (i === 4) result.push({ name: 'Other', bytes: lang.bytes })
			else result[4].bytes += lang.bytes

			return result
		}, [])

	return <LanguagesChart langs={langs} />
}

export const Stats = () => (
	<Card className="flex flex-col">
		<CardHeader className="items-center pb-0">
			<CardTitle>Language Breakdown</CardTitle>
			<CardDescription>Live Codes</CardDescription>
		</CardHeader>
		<CardContent className="aspect-4/3">
			<Suspense fallback={<Skeleton className="size-full" />}>
				<Languages />
			</Suspense>
		</CardContent>
	</Card>
)
