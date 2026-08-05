import { useAppData } from '@/hooks/use-appdata'
import { commitsToChartData, fade } from '@/lib/utils'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@workspace/ui/components/chart'
import { motion } from 'motion/react'
import { Line, LineChart, XAxis } from 'recharts'

const chartConfig = {
	count: {
		label: 'Commits',
		color: 'var(--foreground)',
	},
} satisfies ChartConfig

export const Activity = () => {
	const ctx = useAppData()
	if (ctx.status !== 'ok') return null

	const commitsData = commitsToChartData(ctx.data.commits)

	return (
		<div className='mb-16'>
			<div className='flex items-center justify-between mb-5'>
				<motion.p
					{...fade(0.125)}
					className='text-[11px] tracking-[3px] text-foreground/50 uppercase'
				>
					Commit Activity
				</motion.p>
				<motion.p {...fade(0.125)} className='text-[11px] text-foreground/30'>
					last 12 months
				</motion.p>
			</div>
			<motion.div
				{...fade(0.125)}
				className='border border-foreground/10 rounded-lg p-4'
			>
				<ChartContainer
					config={chartConfig}
					className='w-full h-[160px] min-h-[160px] aspect-auto'
				>
					<LineChart data={commitsData}>
						<XAxis dataKey='date' hide />
						<ChartTooltip
							cursor={{ stroke: 'var(--border)' }}
							content={<ChartTooltipContent />}
						/>
						<Line
							type='monotone'
							dataKey='count'
							stroke='var(--foreground)'
							strokeWidth={1.5}
							dot={false}
							activeDot={{ r: 3, fill: '#a1a1aa' }}
						/>
					</LineChart>
				</ChartContainer>
			</motion.div>
		</div>
	)
}
