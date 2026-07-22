import type { ReactNode } from "react"
import type { Faq } from "./types"
import { Ul, Code, P } from "./components/typography";

export const getImage = (id: string) => `https://mezvgmfypkdvbnzvyxfz.supabase.co/storage/v1/object/public/images/${id}.png` as const

export const products = {
	'discord-bot': {
		media: ['discord-bot-showcase-0', 'discord-bot-showcase-1', 'discord-bot-showcase-2', 'discord-bot-showcase-3', 'discord-bot-showcase-4'],
		title: 'Discord Bot',
		badges: ['Discord', 'Automation'],
		feature: 'v1.3',
		description: 'A customer-gated Discord AI bot built with Rust, Serenity, and Poise. It registers slash commands, creates private AI forum spaces for eligible servers, and replies inside AI threads using a Groq-compatible OpenAI chat completion API.',
		price: 14.99,
		include: (
			<>
				<Ul className="*:text-foreground/66 *:text-sm">
					<li>Lifetime license.</li>
					<li>Documentation.</li>
					<li>Free updates.</li>
					<li>Community support via Discord.</li>
				</Ul>
				<P>Taxes may apply. Final price will be calculated at checkout.</P>
			</>
		),
		accordion: [
			{
				question: 'Delivery',
				answer: 'After the payment, a download link will be instantly sent to your email address followed with your license, after that you will be able to install and use the bot'
			},
			{
				question: 'License',
				answer: 'Purchasing this product grants a lifetime license. Redistribution or resale is prohibited.'
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
	},
} as const satisfies Record<string, {
	media: string[]
	title: string
	badges: string[]
	feature: string
	description: string
	price: number
	include: ReactNode
	accordion: Faq[]
}>