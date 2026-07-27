import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemSeparator, ItemTitle } from "@/components/ui/item"
import { CircleAlert, TrendingUp } from "lucide-react"

const stats = {
	game: {
		wins: 1,
		losses: 2,
	},
	performance: {
		kills: 3,
		deaths: 4,
		assists: 5,
	}
}

export const TopScore = () => {
	return (
		<div className={`absolute w-6/10`}>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-start gap-5">
						<img className="w-2/4 border rounded-4xl" src="https://lenix.dev/favicon-dark.svg" alt="" />
						<div className="flex flex-col">
							<span className="uppercase">Lenix</span>
							<span className="text-yellow-300 text-2xl">1st</span>
						</div>
					</CardTitle>
					<CardAction className="text-foreground/33 flex gap-2">
						<CircleAlert size={19} />
						<p>Updates every minute</p>
					</CardAction>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					<div className="flex gap-5">
						{Object.entries(stats.game).map(([type, value]) => (
							<Item className="bg-accent ring ring-ring/50">
								<ItemContent className="items-center">
									<ItemTitle>{type.toUpperCase()}</ItemTitle>
									<ItemDescription>{value}</ItemDescription>
								</ItemContent>
							</Item>
						))}
					</div>
					<div className="flex gap-3">
						{Object.entries(stats.performance).map(([type, value]) => (
							<Item className="bg-accent ring ring-ring/50">
								<ItemContent className="items-center">
									<ItemTitle>{type.toUpperCase()}</ItemTitle>
									<ItemDescription>{value}</ItemDescription>
								</ItemContent>
							</Item>
						))}
					</div>
				</CardContent>
				<CardFooter>
					<Item className="bg-linear-to-r from-primary/50 to-transparent border-0 ring ring-primary py-3">
						<div className="bg-primary p-2 rounded">
							<TrendingUp />
						</div>
						<ItemContent>
							<ItemTitle className="uppercase text-[0.625rem]">Win Ratio</ItemTitle>
							<ItemDescription className="font-[Syncopate] text-xl">64%</ItemDescription>
						</ItemContent>
					</Item>
				</CardFooter>
			</Card>
		</div>
	)
}