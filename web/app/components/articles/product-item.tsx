import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import type { Product } from "~/types";
import { useNavigate } from "react-router";
import React from "react";

export const ProductItem = ({
	id, media, name, badges, desc, price
}: Product) => {
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
					src={media[0].length ? media[0] : 'https://lenix.dev/favicon-dark.svg'}
					className="aspect-5/4 object-cover group-hover:scale-105 transition" />
			</div>
			<CardHeader>
				<CardTitle className="text-xl">{name}</CardTitle>
					{badges.map(({ content, variant, align }, i) => (
						<React.Fragment>
							{align === 'left'
							? (
								<CardDescription className="flex gap-2">
									<Badge key={i} variant={variant}>{content}</Badge>
								</CardDescription>
							) : (
								<CardAction>
									<Badge key={i} variant={variant}>{content}</Badge>
								</CardAction>
							)}
						</React.Fragment>
					))}
			</CardHeader>
			<CardContent className="line-clamp-3">{desc}</CardContent>
			<CardFooter className="text-xl">{price}</CardFooter>
		</Card>
	);
}
