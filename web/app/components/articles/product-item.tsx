import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import type { Product } from "@/types";
import { useNavigate } from "react-router";

export const ProductItem = ({
	id, media, title, badges, feature, description, price
}: Product & { id: string }) => {
	const navigate = useNavigate()
	return (
		<Card
			className="max-w-sm ring-transparent hover:ring-foreground/10 transition group pt-0 cursor-pointer hover:bg-ring/20"
			onClick={() => {
				navigate(`/products/${id}`)
			}}
		>
			<div className="overflow-hidden">
				<img
					src={media[0]}
					className="aspect-5/4 object-cover group-hover:scale-105 transition" />
			</div>
			<CardHeader>
				<CardTitle className="text-xl">{title}</CardTitle>
				<CardDescription className="flex gap-2">
					{badges.map(badge => <Badge key={badge} variant='outline'>{badge}</Badge>)}
				</CardDescription>
				<CardAction>
					<Badge variant='destructive'>{feature}</Badge>
				</CardAction>
			</CardHeader>
			<CardContent>{description}</CardContent>
			<CardFooter className="text-xl">{price > 0 ? `${price}€` : 'Free'}</CardFooter>
		</Card>
	);
}
