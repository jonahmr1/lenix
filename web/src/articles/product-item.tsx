import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import type { Product } from "@/types";

export const ProductItem = ({
	img, title, badges, feature, description, price
}: Product) => (
	<Card className="max-w-sm ring-transparent hover:ring-foreground/10 transition group pt-0 cursor-pointer hover:bg-ring/20">
		<div className="overflow-hidden">
			<img
				src={img}
				className="aspect-5/4 object-cover group-hover:scale-105 transition"
			/>
		</div>
		<CardHeader>
			<CardTitle className="text-xl">{title}</CardTitle>
			<CardDescription className="flex gap-2">
				{badges.map(badge => <Badge variant='outline'>{badge}</Badge>)}
			</CardDescription>
			<CardAction>
				<Badge variant='destructive'>{feature}</Badge>
			</CardAction>
		</CardHeader>
		<CardContent>{description}</CardContent>
		<CardFooter className="text-xl">{price}€</CardFooter>
	</Card>
)
