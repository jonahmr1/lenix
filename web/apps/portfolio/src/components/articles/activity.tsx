import { useAppData } from '@/hooks/use-appdata'
import { commitsToChartData, fade } from '@/lib/utils'
import { motion } from 'motion/react'
import { Line, LineChart, Tooltip, XAxis } from 'recharts'

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
				<div className='w-full overflow-x-auto'>
					<div className='h-[160px] min-w-[960px]'>
						<LineChart width={960} height={160} data={commitsData}>
							<XAxis dataKey='date' hide />
							<Tooltip
								cursor={{ stroke: 'var(--border)' }}
								contentStyle={{
									background: 'var(--background)',
									border: '1px solid var(--border)',
									borderRadius: 8,
								}}
								labelStyle={{ color: 'var(--foreground)' }}
								itemStyle={{ color: 'var(--foreground)' }}
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
					</div>
				</div>
			</motion.div>
		</div>
	)
}
