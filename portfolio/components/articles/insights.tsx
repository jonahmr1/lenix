import { motion } from 'motion/react'
import { Count } from '../ui/count'
import { commitsToChartData, fade } from '@/lib/utils'
import { useAppData } from '@/hooks/use-appdata'

export const Stats = () => {
	const ctx = useAppData()
	if (ctx.status !== 'ok') return null

	const { loc, commits } = ctx.data
	const commitsData = commitsToChartData(commits)
	const assertions = Math.round(loc.added / 1000)
	const deletions = Math.round(loc.deleted / 1000)

	return (
		<div>
			<div className='flex items-center justify-between mb-5'>
				<motion.p
					{...fade(0.125)}
					className='text-[11px] tracking-[3px] text-foreground/50 uppercase'
				>
					Experience Insights
				</motion.p>
				<motion.p {...fade(0.125)} className='text-[11px] text-foreground/30'>
					last 12 months - live
				</motion.p>
			</div>
			<motion.div
				{...fade(0.125)}
				className='grid grid-cols-4 portrait:grid-cols-2 gap-px border border-foreground/10 rounded-lg overflow-hidden mb-16'
			>
				{[
					{ label: 'Commits', value: commits.length, sub: 'last 12 months' },
					{
						label: 'Lines implemented',
						value: assertions > 0 ? assertions : -1,
						sub: 'live',
					},
					{
						label: 'Average commits per active-day',
						value: (commits.length / commitsData.length).toFixed(1),
						sub: 'last 12 months',
					},
					{
						label: 'Lines refactored',
						value: deletions > 0 ? deletions : -1,
						sub: 'live',
					},
				].map(({ label, value, sub }) => (
					<div key={label} className=' px-5 py-6 text-center'>
						<p className='text-2xl font-semibold text-foreground tabular-nums'>
							<Count className='text-foreground' value={Number(value)} />
							{label !== 'Commits'
								&& label !== 'Average commits per active-day'
								&& 'k'}
							{sub === 'specific time' && '+'}
						</p>
						<p className='text-[11px] text-foreground/60 mt-1'>{label}</p>
						<p className='text-[10px] text-foreground/20 mt-0.5'>{sub}</p>
					</div>
				))}
			</motion.div>
		</div>
	)
}
