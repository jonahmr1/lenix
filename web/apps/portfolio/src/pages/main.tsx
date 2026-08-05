import { Introduc } from '@/components/articles/introduct'
import { Stats } from '@/components/articles/insights'
import { Activity } from '@/components/articles/activity'
import { Langs } from '@/components/articles/langs'
import { Footer } from '@/components/articles/footer'
import { Quotes } from '@/components/articles/quotes'
import { DataProvider } from '@/lib/context'
import { Timeline } from '@/components/articles/timeline'
import { Button } from '@workspace/ui/components/button'
import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { fade } from '@/lib/utils'

export const Main = () => {
	const nav = useNavigate()
	return (
		<DataProvider>
			<div className='w-full flex justify-evenly bg-background text-foreground'>
				<div className='landscape:w-2/3 portrait:w-6/7 h-full flex flex-col gap-20'>
					<div className='h-screen flex flex-col justify-between'>
						<div className='min-h-5/10 flex items-end'>
							<Introduc />
						</div>
						<motion.div {...fade(0.75)} className='h-full flex items-center justify-center gap-2'>
							<Button variant='outline' onClick={() => nav('/contact')}>Contact Me</Button>
							<Button onClick={() => window.open('https://business.lenix.dev', '_blank')}>Explore Business <ExternalLink /></Button>
						</motion.div>
					</div>
					<div className='min-h-screen flex flex-col justify-evenly'>
						<Stats />
						<Activity />
						<Langs />
					</div>
					<Timeline />
					<div>
						<Quotes />
					</div>
					<div className='mt-12'>
						<Footer items={[
							{ label: 'GitHub', url: 'https://github.com/jonahmr1' },
							{
								label: 'Contact',
								url: '/contact',
								replace: true,
							},
						]} />
					</div>
				</div>
			</div>
		</DataProvider>
	)
}
