import { AccordionItems } from "@/articles/faqs"
import { H1 } from "@/components/h1"
import { H2 } from "@/components/h2"
import { Large } from "@/components/large"
import { Layout } from "@/components/layout"
import { Lead } from "@/components/lead"
import { Muted } from "@/components/muted"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ul } from "@/components/ul"
import type { Faq } from "@/types"
import { ArrowRight } from "lucide-react"

const data: Faq[] = [
	{
		question: 'Overview',
		answer: 'Code Hub Discord Bot helps automate and manage Discord communities with configurable features and regular updates.'
	},
	{
		question: 'Features',
		answer: <Ul>
			<li>Slash commands</li>
			<li>Moderation</li>
			<li>Logging</li>
			<li>Auto roles</li>
			<li>Custom configuration</li>
		</Ul>
	},
	{
		question: 'License',
		answer: 'Purchasing this product grants a lifetime license for one Discord server unless otherwise specified. Redistribution or resale is prohibited.'
	},
	{
		question: 'Updates',
		answer: 'The purchase includes free bug fixes and feature updates for the current major version.'
	},
	{
		question: 'Support',
		answer: 'Technical support is available through the contact page. Please include your order number and a detailed description of the issue.'
	},
]

export const Product = () => {
	return (
		<Layout className="mx-[5vw] py-[20vh]">
			<div className="flex *:flex-col gap-10">
				<div className="flex flex-5 gap-10">
					<div className="flex justify-center">
						<img src="/logo.png" className="aspect-video object-cover" />
					</div>
					<AccordionItems data={data} />
				</div>
				<div className="flex-4">
					<div className="flex flex-col gap-10">
						<div className="flex flex-col gap-5">
							<div className="flex gap-2">
								<Badge>Rust</Badge>
								<Badge>AI</Badge>
							</div>
							<div className="flex justify-between w-full">
								<span className="flex items-center gap-2"><H2>Discord Bot </H2><Badge>v1.0.0</Badge></span>
								<Large>19.99€</Large>
							</div>
							<Muted>
								A production-ready Discord bot designed for community management, moderation, automation, and developer workflows.
								The bot is easy to configure, actively maintained, and includes documentation for installation and customization.
							</Muted>
							<div className="flex gap-2">
								<Badge variant='outline'>Digital Download</Badge>
								<Badge variant='outline'>Lifetime License</Badge>
								<Badge variant='outline'>Documentation Included</Badge>
							</div>
							<Button>Buy Now</Button>
							<Button variant='secondary'>Documentation <ArrowRight /></Button>
						</div>
						<div>
							<Lead>Requirements</Lead>
							<Ul>
								<li>
									<Muted>Discord Server</Muted>
								</li>
								<li>
									<Muted>Discord Bot Token</Muted>
								</li>
								<li>
									<Muted>Internet connection</Muted>
								</li>
							</Ul>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}