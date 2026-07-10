import { Products } from "@/components/articles/products"
import { FeatureCard } from "@/components/card"
import { AccordionItems } from "@/components/faqs"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import type { Faq } from "@/types"
import { Book, MessageCircle, Package } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const App = () => {
	const navigate = useNavigate()
	const data: Faq[] = [
		{
			question: 'Is this a one-time purchase?',
			answer: 'Yes. All products are sold as a one-time purchase unless otherwise stated on the product page. There are no recurring subscription fees.'
		},
		{
			question: 'How do I download the product?',
			answer: "After your payment is successfully processed, you'll receive access to download your product along with any applicable license key and installation instructions."
		},
		{
			question: 'Will I receive updates?',
			answer: 'Yes. Every purchase includes free updates within the supported version of the product. Major upgrades, if released separately, may require a new license.'
		},
		{
			question: 'What platforms are supported?',
			answer: 'Supported platforms vary by product. Each product page clearly lists its compatibility, system requirements, and installation instructions before purchase.'
		},
		{
			question: 'What is your refund policy?',
			answer: "Refund requests are handled according to our Refund Policy. If you experience a technical issue that cannot be resolved or the product doesn't match its description, please contact us and we'll review your request."
		},
	]
	const links = [
		{
			link: '',
			label: 'Products'
		},
		{
			link: '',
			label: 'About'
		},
		{
			link: '',
			label: 'Contact'
		},
		{
			link: '',
			label: 'Legal'
		},
		{
			link: '',
			label: 'Github'
		},
	]
	return (
		<div className="w-full bg-background flex justify-center">
			<div className="flex justify-between flex-col h-full w-2/3">
				<div className="flex justify-evenly flex-col min-h-screen w-full gap-10 py-50">
					<div className="flex flex-col items-center gap-5">
						<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
							Software built for developers.
						</h1>
						<p className="leading-7 not-first:mt-6">
							Code Hub develops digital tools, extensions, and utilities that help developers work faster. Every product is delivered digitally and includes documentation and support.
						</p>
						<div className="flex">
							<Button onClick={() => {
								navigate('/products')
							}}>View Products</Button>
							<Button onClick={() => {
								navigate('/docs')
							}}>Documentation</Button>
						</div>
					</div>
					<Products />
					<div>
						<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
							Why Code Hub?
						</h2>
						<br />
						<div className="flex gap-5">
							<FeatureCard title="Digital Delivery" description="Products are delivered electronically after purchase." icon={Package} />
							<FeatureCard title="Documentation" description="Every product includes installation and usage guides." icon={Book} />
							<FeatureCard title="Support" description="Email support is available for all customers." icon={MessageCircle} />
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
							FAQ
						</h3>
						<Accordion>
							<AccordionItems {...{ data }} />
						</Accordion>
					</div>
					<div className="flex w-full items-center">
						<p className="flex-1 text-sm text-muted-foreground">All rights reserved</p>
						<ButtonGroup className="flex flex-1 justify-around">
							{links.map(({ label }) => <Button variant='link'>{label}</Button>)}
						</ButtonGroup>
						<div className="flex-1"></div>
					</div>
				</div>
			</div>
		</div>
	)
}