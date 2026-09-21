import { cache } from "@/lib/cache"
import { Suspense } from "react"
import { Skeleton } from "./ui/skeleton"
import { Timeline, TimelineItem, TimelineHeader, TimelineDate, TimelineTitle, TimelineIndicator, TimelineSeparator, TimelineContent } from "./reui/timeline"
import { Badge } from "./ui/badge"
import { ArrowSquareOutIcon, CheckIcon, CircleNotchIcon, ClockIcon, HourglassIcon, PauseIcon, ProhibitIcon, XIcon } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { cn } from "cn"
import type { Icon } from "@phosphor-icons/react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"

const statusIcons: Record<Awaited<ReturnType<typeof cache.journey>>[number]['status'], {
	icon: Icon
	className: React.ComponentProps<typeof TimelineIndicator>['className']
	hover?: string
}> = {
	success: {
		icon: CheckIcon,
		className: ''
	},
  error: {
		icon: XIcon,
		className: 'bg-red-900 text-red-500'
	},
  paused: {
		icon: PauseIcon,
		className: 'bg-amber-900 text-amber-500',
		hover: 'Paused'
	},
  canceled: {
		icon: ProhibitIcon,
		className: 'bg-muted text-muted-foreground',
		hover: 'Abandoned'
	},
  planned: {
		icon: ClockIcon,
		className: 'bg-sky-900 text-sky-500',
		hover: 'Planned'
	},
  pending: {
		icon: HourglassIcon,
		className: 'bg-accent text-accent-foreground',
		hover: 'In Progress'
	},
}

const JourneyTimeline = async () => {
	const journey = await cache.journey()

	const order = (status: string) => status === 'planned' ? 2 : status === 'pending' ? 1 : 0
	const sortedJourney = journey.toSorted((a, b) => order(a.status) - order(b.status) || new Date(a.date).getTime() - new Date(b.date).getTime())

	return (
		<Timeline defaultValue={sortedJourney.length - 1}>
			{sortedJourney.map(({ date, description, status, tech, url, title }, i) => {
				const Icon = statusIcons[status].icon
				const hover = status === 'pending' ? <CircleNotchIcon className="animate-spin" /> : <Icon weight='bold' />

				return (
					<TimelineItem
						step={i}
						key={i}
						className='
							w-[calc(50%-1.5rem)] odd:ms-auto even:me-auto even:text-right even:group-data-[orientation=vertical]/timeline:ms-0 even:group-data-[orientation=vertical]/timeline:me-8
							even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-indicator]:-right-6 even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-indicator]:left-auto
							even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-indicator]:translate-x-1/2 even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-separator]:-right-6
							even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-separator]:left-auto even:group-data-[orientation=vertical]/timeline:**:data-[slot=timeline-separator]:translate-x-1/2
						'
					>
						<TimelineHeader>
							{status !== 'planned' && status !== 'pending' && <TimelineDate>{date}</TimelineDate>}
							<TimelineTitle>
								{url ? (
									<HoverCard openDelay={50} closeDelay={50}>
										<HoverCardTrigger asChild>
											<Link href={url}>{title}</Link>
										</HoverCardTrigger>
										<HoverCardContent side='top'>
											<Link href={url} target="_blank" className='flex flex-row items-center gap-2 underline'>
												<span className="truncate">{url}</span>
												<ArrowSquareOutIcon />
											</Link>
										</HoverCardContent>
									</HoverCard>
								) : title}
							</TimelineTitle>
						</TimelineHeader>
						<TimelineIndicator className={cn('bg-foreground text-background ring-0 border-0 p-1 flex items-center justify-center', statusIcons[status].className)}>
							{statusIcons[status].hover ? (
								<Tooltip>
									<TooltipTrigger asChild>
										{hover}
									</TooltipTrigger>
									<TooltipContent>
										{statusIcons[status].hover}
									</TooltipContent>
								</Tooltip>
							) : hover}
						</TimelineIndicator>
						<TimelineSeparator />
						<TimelineContent className="space-y-2">
							<div>{description}</div>
							<div className="space-x-1 space-y-px">
								{tech?.map(self => (
									<Badge key={self} variant='outline' className="text-accent-foreground">
										{self}
									</Badge>
								))}
							</div>
						</TimelineContent>
					</TimelineItem>
				)
			})}
		</Timeline>
	)
}


export const Journey = () => {
	return <Suspense fallback={<Skeleton />}>
		<JourneyTimeline />
	</Suspense>
}
