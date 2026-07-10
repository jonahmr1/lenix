import { H1 } from "@/components/h1"
import { H3 } from "@/components/h3"
import { Layout } from "@/components/layout"
import { P } from "@/components/p"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription, CardAction } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

const Product = () => (
	<Card className="max-w-sm ring-transparent hover:ring-foreground/10 transition group pt-0 cursor-pointer hover:bg-ring/20">
		<div className="overflow-hidden">
			<img
				src="/logo.png"
				className="aspect-video object-cover group-hover:scale-105 transition"
			/>
		</div>
		<CardHeader>
			<CardTitle className="text-xl">Discord Bot</CardTitle>
			<CardDescription className="flex gap-2">
				<Badge variant='outline'>Rust</Badge>
				<Badge variant='outline'>AI</Badge>
			</CardDescription>
			<CardAction>
				<Badge variant='destructive'>Sold out</Badge>
			</CardAction>
		</CardHeader>
		<CardContent>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi nesciunt </CardContent>
		<CardFooter className="text-xl">19.99€</CardFooter>
	</Card>
)

export const Products = () => {
	return (
		<Layout>
			<div>
				<H1>Developer Products</H1>
				<P>
					Browse our collection of digital software products designed to improve developer productivity. Every purchase includes documentation and support.
				</P>
			</div>
			<div className="grid grid-cols-3 gap-5">
				<Product />
			</div>
		</Layout>
	)
}