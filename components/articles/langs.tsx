import { useAppData } from '@/hooks/use-appdata'
import { fade, filterLangs } from '@/lib/utils'
import { motion } from 'motion/react'

export const Langs = () => {
	const ctx = useAppData()
	if (ctx.status !== 'ok') return null

	const { filtered, total } = filterLangs(ctx.data.langsBytes)
	return (
		<div>
			<div className='flex items-center justify-between mb-6'>
				<motion.p
					{...fade(0.125)}
					className='text-[11px] tracking-[3px] text-foreground/40 uppercase'
				>
					Used Languages
				</motion.p>
				<motion.p {...fade(0.125)} className='text-[11px] tracking-[3px] text-foreground/40 uppercase'>
					live
				</motion.p>
			</div>
			<motion.div {...fade(0.125)} className='flex flex-col gap-3'>
				{filtered.map((lang, index) => {
					const pct = (lang.bytes / total) * 100
					return (
						<div key={lang.name} className='flex items-center gap-4'>
							<p className='w-14 text-right text-[12px] text-foreground/60 shrink-0'>
								{lang.name}
							</p>
							<div className='flex-1 h-px bg-foreground/10 relative'>
								<motion.div
									className='absolute hover:bg-foreground/80 top-1/2 -translate-y-1/2 h-[2px] bg-foreground/60 origin-left'
									initial={{ scaleX: 0 }}
									animate={{ scaleX: 1 }}
									transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
									style={{ width: `${pct}%` }}
								/>
							</div>
							<p className='w-8 text-[11px] text-foreground/30 tabular-nums'>
								{pct.toFixed(1)}%
							</p>
						</div>
					)
				})}
			</motion.div>
		</div>
	)
}
