import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Fragment, Suspense } from 'react'
import { cache } from '@/lib/cache'
import { LanguagesChart } from './stats.client'
import { entries } from '@lenix/lenix'
import { Separator } from './ui/separator'
import { Muted } from './typography'
import { MinusIcon, PlusIcon } from '@phosphor-icons/react/dist/ssr'
import { compact } from '@/lib/utils'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Language } from '@/lib/types'
dayjs.extend(relativeTime)


const ignoredLangs = ['MDX', 'CSS', 'JavaScript']


const Languages = async () => {
  const states = await cache.github()

  const langs = states.langs
    .filter((lang) => !ignoredLangs.includes(lang.name))
    .sort((a, b) => b.bytes - a.bytes)
    .reduce<Language[]>((result, lang, i) => {
      if (i < 4) result.push(lang)
      else if (i === 4) result.push({ name: 'Other', bytes: lang.bytes })
      else result[4].bytes += lang.bytes

      return result
    }, [])

  return <LanguagesChart langs={langs} />
}

const Lines = async () => {
  const states = await cache.github()

  return (
    <div className='size-full flex flex-col items-start portrait:items-center justify-start py-10 gap-5'>
			{entries(states.lines).map(([type, stat]) => (
				<Fragment key={type}>
					<div className='flex items-center gap-5'>
						{type === 'added' ? <PlusIcon className='text-4xl' /> : <MinusIcon className='text-4xl' />}
						<div>
							<p className='text-6xl mt-0 text-foreground'>{compact.format(stat)}</p>
							<Muted className='mt-0'>Lines {type}</Muted>
						</div>
					</div>
					<Separator className='last:hidden' />
				</Fragment>
			))}
		</div>
  )
}
const LastUpdated = async () => {
	const states = await cache.github()

  return <p className='text-foreground'>{dayjs(states.updated_at).fromNow()}</p>
}

export const Stats = () => (
  <div className="flex size-full gap-10 portrait:flex-col">
    <Card className="flex size-full flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Stats Breakdown</CardTitle>
        <CardDescription>Live Stats</CardDescription>
				<CardAction className='flex items-center gap-1 *:mt-0'>
					<p className='text-accent-foreground'>Refreshed:</p>
					<Suspense fallback={<Skeleton className='w-20 h-3' />}>
						<LastUpdated />
					</Suspense>
				</CardAction>
      </CardHeader>
      <CardContent className="flex portrait:flex-col justify-between portrait:gap-10 px-5 pb-5">
				{[
					{
						title: 'Languages (bytes)',
						element: <Languages />
					},
					{
						title: 'Lines of codes',
						element: <Lines />
					},
				].map(({ title, element }) => (
					<Fragment key={title}>
						<div className='w-45/100 portrait:w-full portrait:h-45/100 flex flex-col'>
							<h3 className='text-accent-foreground'>{title}</h3>
							<div className='flex-1 min-h-0'>
								<Suspense fallback={<Skeleton className='aspect-square' />}>
									{element}
								</Suspense>
							</div>
						</div>
						<Separator orientation='vertical' className='last:hidden' />
					</Fragment>
				))}
      </CardContent>
    </Card>
  </div>
)
