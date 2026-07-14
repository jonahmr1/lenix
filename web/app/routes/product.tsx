import { AccordionItems } from "@/components/articles/faqs"
import { Layout } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { products } from "@/constants"
import type { ProductSlug } from "@/types"
import { H2, Large, Lead, Muted } from "@lenix/lenix"
import { ArrowRight } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import NotFound from "./404"
import { toast } from "sonner"

export default () => {
	const navigate = useNavigate()
	const slug = useParams().slug as ProductSlug | undefined
	if (!slug || !products[slug]) return <NotFound />

	const {
		media,
		title,
		badges,
		feature,
		description,
		price,
		features,
		accordion
	} = products[slug]

	return (
		<Layout className="mx-[10vw]">
			<div className="flex *:flex-col gap-10 portrait:flex-col">
				<div className="flex flex-5 gap-10 items-center *:w-9/10 *:portrait:w-full">
					<Carousel>
						<CarouselContent>
							{media.map(item => (
								<CarouselItem key={item}>
									<img src={item} className="aspect-video object-cover rounded-md" />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className='portrait:hidden' />
						<CarouselNext className='portrait:hidden' />
					</Carousel>
					<div className="portrait:hidden">
						<AccordionItems data={accordion} />
					</div>
				</div>
				<div className="flex-4">
					<div className="flex flex-col gap-10">
						<div className="flex flex-col gap-5">
							<div className="flex justify-between">
								<div className="flex gap-2">
									{badges.map(badge => <Badge variant='secondary' key={badge}>{badge}</Badge>)}
								</div>
								<Badge>{feature}</Badge>
							</div>
							<div className="flex justify-between w-full">
								<H2>{title}</H2>
								<Large>{price > 0 ? `${price}€` : 'Free'}</Large>
							</div>
							<Muted>{description}</Muted>
							<Button onClick={() => {
								toast('Sales are not yet available.')
							}}>Buy Now</Button>
							<Button variant='secondary' onClick={() => {
								navigate(`/docs/${slug}`)
							}}>View Documentation <ArrowRight /></Button>
						</div>
						<div>
							<Lead>Features</Lead>
							{features}
						</div>
					</div>
				</div>
				<div className="hidden portrait:flex">
					<AccordionItems data={accordion} />
				</div>
			</div>
		</Layout>
	)
}
