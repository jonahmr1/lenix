import { H2 } from "./components/h2"
import { Badge } from "./components/ui/badge"
import { Ul } from "./components/ul"
import type { Products } from "./types"

export const products: Products = {
	'discord-bot': {
		img: '/logo.png',
		title: <>
			<H2>Discord Bot </H2><Badge>v1.0.0</Badge>
		</>,
		badges: ['Discord', 'Automation'],
		feature: 'Sold out',
		description: 'A production-ready Discord bot designed for community management, moderation, automation, and developer workflows. The bot is easy to configure, actively maintained, and includes documentation for installation and customization.',
		price: 19.99,
		docs: '',
		requirements: ['Discord Server', 'Discord Bot Token', 'Internet connection'],
		accordion: [
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
	},
}