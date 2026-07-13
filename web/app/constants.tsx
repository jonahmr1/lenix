import type { ReactNode } from "react"
import type { Faq } from "./types"
import { Ul, Code } from "@lenix/lenix"

export const products = {
	'discord-bot': {
		media: ['/logo.png', '/favicon.ico'],
		title: 'Discord Bot',
		badges: ['Discord', 'Automation'],
		feature: 'Sold out',
		description: 'A customer-gated Discord AI bot built with Rust, Serenity, and Poise. It registers slash commands, creates private AI forum spaces for eligible servers, and replies inside AI threads using a Groq-compatible OpenAI chat completion API.',
		price: 0,
		docs: '',
		features: <Ul className="*:text-foreground/66 *:text-sm">
			<li><Code>/ping</Code> replies with a private Pong confirmation.</li>
			<li><Code>/lenix</Code> replies with a private Lenix greeting.</li>
			<li><Code>/ai-space</Code> posts a button for creating or opening a private AI forum space.</li>
			<li>AI spaces are created as Discord forum channels named per user.</li>
			<li>AI thread replies keep in-memory conversation history per thread.</li>
			<li>Commands are restricted to configured customer servers.</li>
		</Ul>,
		accordion: [
			{
				question: 'Requirements',
				answer: <Ul className="mb-0">
					<li>Discord application and bot token</li>
					<li>Rust 2024 runtime/build environment</li>
					<li>Groq API key for AI replies</li>
					<li>Configured eligible customer server IDs</li>
					<li>Message Content intent enabled for AI thread replies</li>
					<li>Bot permissions to create forum channels, manage threads, and send thread messages</li>
				</Ul>,
			},
			{
				question: 'Delivery',
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
} as const satisfies Record<string, {
	media: string[]
	title: string
	badges: string[]
	feature: string
	description: string
	price: number
	docs: string
	features: ReactNode
	accordion: Faq[]
}>