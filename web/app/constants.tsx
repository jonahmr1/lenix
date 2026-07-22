import type { ComponentProps, ReactNode } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./components/ui/card"
import { Badge } from "./components/ui/badge"

export const products = {
	'discord-bot': {
		media: ['discord-bot-showcase-0', 'discord-bot-showcase-1', 'discord-bot-showcase-2', 'discord-bot-showcase-3', 'discord-bot-showcase-4'],
		title: 'Discord Bot',
		badges: {
			primary: [
				{
					content: 'Discord',
					variant: 'outline'
				},
				{
					content: 'Automation',
					variant: 'outline'
				},
			],
			secondary: [
				{
					content: 'v1.3',
					variant: 'default'
				},
			]
		},
		description: 'A customer-gated Discord AI bot built with Rust, Serenity, and Poise. It registers slash commands, creates private AI forum spaces for eligible servers, and replies inside AI threads using a Groq-compatible OpenAI chat completion API.',
		price: 14.99,
		tabs: [
			{
				title: 'Overview',
				content: (
					<Card>
						<CardHeader>
							<CardTitle>Overview</CardTitle>
							<CardDescription>
								View your key metrics and recent project activity. Track progress
								across all your active projects.
							</CardDescription>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							You have 12 active projects and 3 pending tasks.
						</CardContent>
					</Card>
				)
			},
		]
	}
} as const satisfies Record<string, {
	media: string[]
	title: string
	badges: {
		primary: {
			content: string
			variant: ComponentProps<typeof Badge>['variant']
		}[]
		secondary: {
			content: string
			variant: ComponentProps<typeof Badge>['variant']
		}[]
	}
	description: string
	price: number
	tabs: {
		title: string
		content: ReactNode
	}[]
}>