import type { ComponentProps, ReactNode } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./components/ui/card"
import { Badge } from "./components/ui/badge"

export const products = {} as const satisfies Record<string, {
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