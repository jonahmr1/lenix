import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

export function Products() {
	const products = [
		{
			title: 'FiveM Receipt',
			subTitle: 'FiveM Receipt Generator',
			describtion: 'Professional FiveM receipt system with configurable templates and framework selection.',
			badges: [
				'Lifetime license',
				'Free updates',
				'Documentation',
			],
			price: 199.99,
			onClick: () => { }
		},
		{
			title: 'VSCode Extension',
			subTitle: 'VSCode AI Extension',
			describtion: 'AI-powered VSCode extension that speeds up development with reusable snippets, commands, and productivity tools.',
			badges: [
				'Early access',
				'Automatic updates',
				'Commercial license',
			],
			price: 99.99,
			onClick: () => { }
		},
	]
	return (
		<div className="flex flex-col gap-2">
			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
				Featured Products
			</h3>
			<Tabs defaultValue="1" className="w-full">
				<TabsList>
					{products.map(({ title }, i) => (
						<TabsTrigger key={i} value={i}>{title}</TabsTrigger>
					))}
				</TabsList>
				{products.map(({ subTitle, describtion, badges, price, onClick }, i) => (
					<TabsContent value={i}>
						<Card>
							<CardHeader>
								<CardTitle>{subTitle}</CardTitle>
							</CardHeader>
							<CardContent className="text-sm text-muted-foreground">
								<p className="leading-7 not-first:mt-6">
									{describtion}
								</p>
								<ul className="ml-6 list-disc [&>li]:mt-2">
									{badges.map(badge => (
										<li key={badge}>{badge}</li>
									))}
								</ul>
							</CardContent>
							<CardFooter className="flex flex-col items-start gap-4">
								<CardDescription><b>{price}€</b></CardDescription>
								<div className="flex gap-1">
									<Badge variant='outline'>Digital Download</Badge>
									<Badge variant='outline'>One-time purchase</Badge>
								</div>
								<Button onClick={onClick}>Learn More</Button>
							</CardFooter>
						</Card>
					</TabsContent>
				))}
			</Tabs>
		</div>
	)
}
