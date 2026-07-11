import { AccordionItems } from "@/articles/faqs"
import { H2 } from "@/components/h2"
import { Large } from "@/components/large"
import { Layout } from "@/components/layout"
import { Lead } from "@/components/lead"
import { Muted } from "@/components/muted"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ul } from "@/components/ul"
import { products } from "@/constants"
import { ArrowRight } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

export const Product = () => {
	const navigate = useNavigate()
	const { slug } = useParams()
	if (!slug || !products[slug]) return <></>
	
	const {
		img,
		title,
		badges,
		feature,
		description,
		price,
		docs,
		requirements,
		accordion
	} = products[slug]

	return (
		<Layout className="mx-[5vw] py-[20vh]">
			<div className="flex *:flex-col gap-10">
				<div className="flex flex-5 gap-10">
					<div className="flex justify-center">
						<img src={img} className="aspect-video object-cover" />
					</div>
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
							<Lead>Requirements</Lead>
							<Ul>
								{requirements.map((requirement, i) => (
									<li key={i}>
										<Muted>{requirement}</Muted>
									</li>
								))}
							</Ul>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}