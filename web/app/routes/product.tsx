import { AccordionItems } from "@/components/articles/faqs"
import { H2 } from "../../../modules/components/h2.tsx"
import { Large } from "../../../modules/components/large.tsx"
import { Layout } from "@/components/layout"
import { Lead } from "../../../modules/components/lead.tsx"
import { Muted } from "../../../modules/components/muted.tsx"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { products } from "@/constants"
import type { ProductSlug } from "@/types"
import { ArrowRight } from "lucide-react"
import { useNavigate, useParams } from "react-router"

export default () => {
	const navigate = useNavigate()
	const slug = useParams().slug as ProductSlug | undefined
	if (!slug || !products[slug]) return <></>

	const {
		media,
		title,
		badges,
		feature,
		description,
		price,
		docs,
		features,
		accordion
	} = products[slug]

	return (
		<Layout className="mx-[5vw] py-[20vh]">
			<div className="flex *:flex-col gap-10">
				<div className="flex flex-5 gap-10 items-center">
					<Carousel className="w-9/10">
						<CarouselContent>
							{media.map(item => (
								<CarouselItem key={item}>
									<img src={item} className="aspect-video object-cover rounded-md" />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
					<AccordionItems data={accordion} />
				</div>
				<div className="flex-4">
					<div className="flex flex-col gap-10">
						<div className="flex flex-col gap-5">
							<div className="flex justify-between">
								<div className="flex gap-2">
									{badges.map(badge => <Badge variant='secondary' key={badge}>{badge}</Badge>)}
								</div>
								<Badge variant='destructive'>{feature}</Badge>
							</div>
							<div className="flex justify-between w-full">
								<H2>{title}</H2>
								<Large>{price > 0 ? `${price}€` : 'Free'}</Large>
							</div>
							<Muted>{description}</Muted>
							<Button>Buy Now</Button>
							<Button variant='secondary' onClick={() => {
								navigate(docs)
							}}>View Documentation <ArrowRight /></Button>
						</div>
						<div>
							<Lead>Features</Lead>
							{features}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}