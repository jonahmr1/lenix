import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { fade } from '@/lib/utils'
import {
	BubbleChatDoneIcon,
	CheckmarkCircle03Icon,
	EuroCircleIcon,
	Package03Icon,
	Settings05Icon,
	ToolsIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { motion } from 'motion/react'
import { Link } from 'react-router'

const features: {
	title: string
	description: string
	icon: IconSvgElement
}[] = [
	{
		title: 'Reliability',
		description: 'Dependable products built for consistent performance and durability.',
		icon: ToolsIcon,
	},
	{
		title: 'Fair Pricing',
		description: 'Pricing focused on practical value and clear expectations.',
		icon: EuroCircleIcon,
	},
	{
		title: 'Support',
		description: 'Direct support for setup, technical issues, and ongoing maintenance.',
		icon: BubbleChatDoneIcon,
	},
]

const focus = [
	{
		title: 'Developer Needs',
		description:
			'High-quality products designed to reduce repetitive workflows and help developers move faster.',
		icon: Settings05Icon,
	},
	{
		title: 'Digital Products',
		description:
			'Focused, niche tools built around real usage instead of generic product volume.',
		icon: Package03Icon,
	},
	{
		title: 'Long-Term Support',
		description:
			'Fewer products, more care, and continued improvements after release.',
		icon: ToolsIcon,
	},
] satisfies typeof features

const principles = [
	'Reliable software',
	'Clear documentation',
	'Fair pricing',
	'Customer support',
	'Secure solutions',
	'Privacy first',
]

const faqs = [
	{
		question: 'Do you have any free products?',
		answer: (
			<span>
				Yes. Free and open-source work is available on{' '}
				<a
					href='https://github.com/jonahmr1'
					target='_blank'
					rel='noopener noreferrer'
				>
					GitHub
				</a>
				.
			</span>
		),
	},
	{
		question: 'What is your refund policy?',
		answer:
			"Refund requests are reviewed fairly. If a technical issue cannot be resolved or a product does not match its description, contact me and I'll review the case.",
	},
]

const FeatureCard = ({
	title,
	description,
	icon,
}: {
	title: string
	description: string
	icon: IconSvgElement
}) => (
	<Card>
		<CardHeader className='gap-4'>
			<HugeiconsIcon icon={icon} size={30} strokeWidth={1.8} />
			<CardTitle>{title}</CardTitle>
		</CardHeader>
		<CardContent>
			<CardDescription>{description}</CardDescription>
		</CardContent>
	</Card>
)

export const Business = () => (
	<motion.section {...fade(0.125)} className='space-y-16'>
		<div className='space-y-5'>
			<p className='text-[11px] tracking-[3px] text-foreground/50 uppercase'>
				Lenix Business
			</p>
			<div className='grid gap-8 landscape:grid-cols-[1.1fr_0.9fr] landscape:items-end'>
				<div className='space-y-4'>
					<h2 className='text-4xl font-semibold tracking-tight text-foreground'>
						Software products for developers, communities, and businesses.
					</h2>
					<p className='max-w-2xl text-sm leading-7 text-foreground/40'>
						Lenix builds digital products that automate repetitive tasks,
						improve workflows, and save development time.
					</p>
				</div>
				<div className='flex gap-3 landscape:justify-end portrait:flex-col'>
					<Button asChild>
						<Link to='/contact'>Start a project</Link>
					</Button>
					<Button variant='secondary' asChild>
						<a
							href='https://github.com/jonahmr1'
							target='_blank'
							rel='noopener noreferrer'
						>
							View free products
						</a>
					</Button>
				</div>
			</div>
		</div>

		<div className='grid grid-cols-3 gap-4 portrait:grid-cols-1'>
			{features.map(item => (
				<FeatureCard key={item.title} {...item} />
			))}
		</div>

		<div className='space-y-5'>
			<h3 className='text-2xl font-semibold tracking-tight'>My Focus</h3>
			<div className='grid grid-cols-3 gap-4 portrait:grid-cols-1'>
				{focus.map(item => (
					<FeatureCard key={item.title} {...item} />
				))}
			</div>
		</div>

		<div className='grid gap-8 landscape:grid-cols-[0.85fr_1.15fr]'>
			<div className='space-y-5'>
				<h3 className='text-2xl font-semibold tracking-tight'>My Principles</h3>
				<Card>
					<CardContent>
						<ul className='grid gap-3 text-sm text-foreground/70'>
							{principles.map(item => (
								<li key={item} className='flex items-center gap-2'>
									<HugeiconsIcon
										icon={CheckmarkCircle03Icon}
										size={16}
										strokeWidth={2}
									/>
									{item}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			<div className='space-y-5'>
				<h3 className='text-2xl font-semibold tracking-tight'>FAQ</h3>
				<Accordion type='single' collapsible>
					{faqs.map(({ question, answer }) => (
						<AccordionItem key={question} value={question}>
							<AccordionTrigger>{question}</AccordionTrigger>
							<AccordionContent>{answer}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	</motion.section>
)
