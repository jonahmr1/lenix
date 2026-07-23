import type { ReactNode } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./app/components/ui/card"
import type { BadgeItem } from "./app/types"

export const products = {} as const satisfies Record<string, {
	title: string
	description: string
	media: string[]
	price: number
	badges: {
		primary: BadgeItem[]
		secondary: BadgeItem[]
	}
	tabs: {
		title: string
		content: ReactNode
	}[]
}>

{/* <Card>
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
</Card> */}