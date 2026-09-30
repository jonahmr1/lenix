import { Journey } from '@/components/portfolio/journey'
import { Layout } from '@/components/layout'
import { Nav } from '@/components/portfolio/nav'
import { Reveal } from '@/components/reveal'
import { Stats } from '@/components/portfolio/stats'
import { Lead, Muted } from '@/components/typography'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { CURRENT_USERNAME } from '@/lib/utils'
import { GithubLogoIcon, CreditCardIcon, FileTextIcon, MusicNoteSimpleIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { ComponentProps } from 'react'

const buttons: {
	label: string
	link: string
	icon: React.ReactNode
	variant?: ComponentProps<typeof Button>['variant']
}[] = [
	{
		label: 'Try Tonelix',
		link: 'tone',
		icon: <MusicNoteSimpleIcon />,
		variant: 'default',
	},
	{
		label: 'GitHub',
		link: `https://github.com/${CURRENT_USERNAME}`,
		icon: <GithubLogoIcon />,
	},
	{
		label: 'Resume',
		link: 'resume.pdf',
		icon: <FileTextIcon />,
	},
]

export const metadata = {
	alternates: { canonical: 'https://lenix.dev' },
}

export default async function Page() {
	return (
		<Layout className="pt-0">
			<Nav />
			<Reveal className="flex min-h-screen flex-col justify-center gap-10">
				<div className="flex flex-col items-start">
					<Muted className="font-light tracking-widest uppercase opacity-60">01 / Introduction</Muted>
					<h1>Lenix</h1>
					<Lead>Self-taught software engineer since 2008-04-06</Lead>
					<Muted className="opacity-50">Full-Stack AI Engineer</Muted>
				</div>
				<ButtonGroup className="w-full justify-center">
					{buttons.map((button) => (
						<Button key={button.label} variant={button?.variant ?? 'outline'} className="border border-border" asChild>
							<Link className="no-underline" href={button.link} target="_blank">
								{button.label}
								{button.icon}
							</Link>
						</Button>
					))}
				</ButtonGroup>
			</Reveal>
			<Reveal className="flex justify-between gap-20 portrait:flex-col min-h-1/2">
				<div className="flex flex-col items-start">
					<Muted className="font-light tracking-widest uppercase opacity-50">02 / About</Muted>
					<h1>Mentality</h1>
				</div>
				<div className="flex w-full flex-col gap-10 divide-y-2">
					{[
						{
							head: 'Focus',
							body: 'Always quality over quantity, Fewer but better.',
						},
						{
							head: 'Philosophy',
							body: 'Niche solutions, Clean code, Clear documentation',
						},
						{
							head: 'Purpose',
							body: 'Reliability & Performance first, Privacy & Security by design.',
						},
					].map(({ head, body }, i) => (
						<div key={i} className="flex items-center justify-between not-last:pb-10 gap-5">
							<div className="flex items-start gap-10">
								<Muted className="font-light tracking-widest opacity-50">0{i + 1}</Muted>
								<h2>{head}</h2>
							</div>
							<p>{body}</p>
						</div>
					))}
				</div>
			</Reveal>
			<Reveal className="flex flex-col gap-10">
				<div className="flex flex-col items-start">
					<Muted className="font-light tracking-widest uppercase opacity-60">03 / Numbers</Muted>
					<h1>Stats</h1>
				</div>
				<Stats />
			</Reveal>
			<Reveal className="flex flex-col gap-10">
				<div className="flex flex-col items-start">
					<Muted className="font-light tracking-widest uppercase opacity-60">04 / Journey</Muted>
					<h1>Milestones</h1>
				</div>
				<Journey />
			</Reveal>
		</Layout>
	)
}

{
	/* <a href="https://buy.polar.sh/polar_cl_ihhMVbNL2cuRAKiafieSfHSXpcaGfSNK0sn1N0zqZtx" data-polar-checkout data-polar-checkout-theme="dark">Purchase</a>
<script src="https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js" defer data-auto-init></script> */
}
