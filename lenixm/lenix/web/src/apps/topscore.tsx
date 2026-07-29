import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { CircleAlert, TrendingUp } from "lucide-react";

const stats = {
	game: {
		wins: 1,
		losses: 2,
	},
	performance: {
		kills: 3,
		deaths: 4,
		assists: 5,
	},
};

export const TopScore = () => {
	return (
		<div className="absolute w-[clamp(320px,28vw,560px)] max-w-[90vw]">
			<Card>
				<CardHeader className="gap-[clamp(12px,1vw,20px)]">
					<CardTitle className="flex items-center gap-[clamp(12px,1vw,20px)]">
						<img
							src="https://lenix.dev/favicon-dark.svg"
							alt=""
							className="size-[clamp(64px,7vw,128px)] shrink-0 rounded-full border object-cover"
						/>
						<div className="flex flex-col">
							<span className="text-[clamp(1rem,1.2vw,2rem)] font-bold uppercase">
								Lenix
							</span>

							<span className="text-[clamp(.9rem,1vw,1.5rem)] font-semibold text-yellow-300">
								1st
							</span>
						</div>
					</CardTitle>

					<CardAction className="flex items-center gap-[clamp(6px,.5vw,10px)] text-[clamp(.7rem,.7vw,.95rem)] text-foreground/40">
						<CircleAlert className="size-[clamp(16px,1vw,22px)]" />
						<span>Updates every minute</span>
					</CardAction>
				</CardHeader>

				<CardContent className="flex flex-col gap-[clamp(10px,.8vw,18px)]">
					<div className="grid grid-cols-2 gap-[clamp(8px,.8vw,16px)]">
						{Object.entries(stats.game).map(([type, value]) => (
							<Item
								key={type}
								className="bg-accent ring ring-ring/50 p-[clamp(10px,.8vw,18px)]"
							>
								<ItemContent className="items-center">
									<ItemTitle className="text-[clamp(.65rem,.7vw,.9rem)]">
										{type.toUpperCase()}
									</ItemTitle>

									<ItemDescription className="text-[clamp(1rem,1.4vw,2rem)] font-bold">
										{value}
									</ItemDescription>
								</ItemContent>
							</Item>
						))}
					</div>

					<div className="grid grid-cols-3 gap-[clamp(8px,.8vw,16px)]">
						{Object.entries(stats.performance).map(([type, value]) => (
							<Item
								key={type}
								className="bg-accent ring ring-ring/50 p-[clamp(10px,.8vw,18px)]"
							>
								<ItemContent className="items-center">
									<ItemTitle className="text-[clamp(.65rem,.7vw,.9rem)]">
										{type.toUpperCase()}
									</ItemTitle>

									<ItemDescription className="text-[clamp(1rem,1.4vw,2rem)] font-bold">
										{value}
									</ItemDescription>
								</ItemContent>
							</Item>
						))}
					</div>
				</CardContent>

				<CardFooter>
					<Item className="w-full border-0 bg-linear-to-r from-primary/50 to-transparent p-[clamp(10px,.8vw,18px)] ring ring-primary">
						<div className="rounded bg-primary p-[clamp(8px,.7vw,14px)]">
							<TrendingUp className="size-[clamp(18px,1vw,28px)]" />
						</div>

						<ItemContent>
							<ItemTitle className="text-[clamp(.65rem,.7vw,.9rem)] uppercase">
								Win Ratio
							</ItemTitle>

							<ItemDescription className="font-[Syncopate] text-[clamp(1rem,1.6vw,2.2rem)] font-bold">
							{((stats.game.wins / (stats.game.wins + stats.game.losses || 1)) * 100).toFixed(2)}%
							</ItemDescription>
						</ItemContent>
					</Item>
				</CardFooter>
			</Card>
		</div>
	);
};