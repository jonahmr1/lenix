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
import { Button } from "../ui/button"
import { toast } from "sonner"
import { Badge } from "../ui/badge"

export function Pricing() {
	return (
		<div className="flex flex-col gap-2">
			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
				Pricing
			</h3>
			<Tabs defaultValue="1" className="w-full">
				<TabsList>
					<TabsTrigger value="1">FiveM Receipt</TabsTrigger>
					<TabsTrigger value="5">VSCode Extension</TabsTrigger>
				</TabsList>
				<TabsContent value="1">
					<Card>
						<CardHeader>
							<CardTitle>FiveM Receipt Generator</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							<p className="leading-7 not-first:mt-6">
								Professional FiveM receipt system with configurable templates and framework selection.
							</p>
							<ul className="ml-6 list-disc [&>li]:mt-2">
								<li>Lifetime license</li>
								<li>Free updates</li>
								<li>Documentation</li>
								<li>Email support</li>
							</ul>
						</CardContent>
						<CardFooter className="flex flex-col items-start gap-4">
							<CardDescription>One-time purchase <b>199.99€</b></CardDescription>
							<Badge variant='outline'>Digital Download</Badge>
							<Button onClick={() =>
								toast("Purchases are temporarily unavailable :(")
							}>Buy Now</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="5">
					<Card>
						<CardHeader>
							<CardTitle>VSCode AI Extension</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							<p className="leading-7 not-first:mt-6">
								AI-powered VSCode extension that speeds up development with reusable snippets, commands, and productivity tools.
							</p>
							<ul className="ml-6 list-disc [&>li]:mt-2">
								<li>Early access</li>
								<li>Automatic updates</li>
								<li>Commercial license</li>
							</ul>
						</CardContent>
						<CardFooter className="flex flex-col items-start gap-4">
							<CardDescription>One-time purchase <b>99.99€</b></CardDescription>
							<Badge variant='outline'>Digital Download</Badge>
							<Button onClick={() =>
								toast("Purchases are temporarily unavailable :(")
							}>Buy Now
						</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
