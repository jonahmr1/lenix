import { Ul } from "./components/ul"
import type { Products } from "./types"

export const products: Products = {
	'discord-bot': {
		img: '/logo.png',
		title: 'Discord Bot',
		badges: ['Discord', 'Automation'],
		feature: 'Sold out',
		description: 'A production-ready Discord bot designed for community management, moderation, automation, and developer workflows. The bot is easy to configure, actively maintained, and includes documentation for installation and customization.',
		price: 0,
		docs: '',
		requirements: ['Discord Server', 'Discord Bot Token'],
		accordion: [
			{
				question: 'Features',
				answer: <Ul>
					<li>Slash commands</li>
					<li>Custom configuration</li>
				</Ul>
			},
			{
				question: 'Deliver',
				answer: 'After the payment, a download link will be sent to your email address followed with your license.'
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