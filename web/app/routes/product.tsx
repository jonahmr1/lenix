import { AccordionItems } from "@/components/articles/faqs"
import { Layout } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getImage, products } from "@/constants"
import type { ProductSlug } from "@/types"
import { ArrowRight } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import NotFound from "./404"
import { toast } from "sonner"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"
import { Large } from "../components/typography/large";
import { H2 } from "../components/typography/h2";
import { Muted } from "../components/typography/muted";
import { Lead } from "../components/typography/lead";

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
		include,
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
									<Zoom>
										<img
											src={getImage(item)}
											className="aspect-video w-full rounded-md object-cover"
											alt=""
										/>
									</Zoom>
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
								<Large>{price > 0 ? `${price}€` : 'Free'} / Lifetime</Large>
							</div>
							<Muted>{description}</Muted>
							<Button onClick={() => {
								toast('Sales are not yet available.')
							}}>Buy Now</Button>
							<Button variant='secondary' onClick={() => {
								navigate(`/docs/products/${slug}`)
							}}>View Documentation <ArrowRight /></Button>
						</div>
						<div>
							<Lead>What's included</Lead>
							{include}
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
