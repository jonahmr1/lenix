import { FeatureCard } from "@/components/articles/card"
import { AccordionItems } from "@/components/articles/faqs"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import type { Faq } from "@/types"
import { MessageCircle, Check, Package, Settings, Wrench, Euro } from "lucide-react"
import { useNavigate } from "react-router"
import { Footer } from "~/components/articles/footer"
import { Card } from "@/components/ui/card";
import { H1, H2, P, Ul } from "~/components/typography"

const data: Faq[] = [
	{
		question: 'Is there any one-time purchases?',
		answer: 'No, Code Hub is designed to provide all of it\'s products among with licenses'
	},
	{
		question: 'Do you have any free products?',
		answer: <span>Yes, but not in here, since Code Hub tend to provide paid products only, you can check out Lenix publish all of his free products on <Button className='px-0' variant='link' onClick={() => window.open('https://github.com/jonahmr1', "_blank")}>GitHub</Button></span>
	},
	{
		question: 'How does the support work?',
		answer: 'Code Hub support life time support for the customers that have active license and there products products are still available in the stock.'
	},
	{
		question: 'Are the products taxable?',
		answer: 'Not necessarly. taxes may apply depending on your payment situation, such as the method, country,... . Final price will be calculated at checkout.'
	},
	{
		question: 'Will I receive updates?',
		answer: 'Yes. Every purchase includes free updates within the supported version of the product. Major upgrades, if released separately, may require a new license.'
	},
	{
		question: 'What is your refund policy?',
		answer: "Refund requests are handled according to our Refund Policy. If you experience a technical issue that cannot be resolved or the product doesn't match its description, please contact us and we'll fairly review your request."
	},
	{
		question: 'How do I download the product?',
		answer: "After your payment is successfully processed, you'll receive access to download your product along with any applicable license key and installation instructions."
	},
]

export default () => {
	const navigate = useNavigate()
	return (
		<Layout>
			<div className="flex flex-col items-center justify-center gap-5">
				<H1>Welcome To Code Hub</H1>
				<P className="text-center">Code Hub develops software products that help developers and business owners work faster and move forward.</P>
				<div className="flex portrait:flex-col gap-3">
					<Button onClick={() => {
						navigate('products')
					}}>View Products</Button>
					<Button onClick={() => {
						navigate('/docs')
					}}>Documentation</Button>
				</div>
			</div>

			<div className="flex flex-col justify-center">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					Why Code Hub?
				</h2>
				<br />
				<div className="flex gap-5 portrait:flex-col">
					<FeatureCard title="Reliability" description="Dependable products built for consistent performance and durability." icon={Wrench} />
					<FeatureCard title="Pricing" description="Fair pricing for every purchase where every cent deserve being payed." icon={Euro} />
					<FeatureCard title="Support" description="Support is our first philosophic priority, it's what keeps us the best." icon={MessageCircle} />
				</div>
			</div>

			<div className="flex flex-col gap-2 justify-center">
				<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
					FAQ
				</h3>
				<AccordionItems {...{ data }} />
			</div>
			<div className="space-y-5">
				<H1>About Code Hub</H1>
				<P>
					Code Hub develops software for developers,
					communities, and businesses.
					We build digital products that automate
					repetitive tasks, improve workflows, and
					save development time.
				</P>
			</div>
			<div className="space-y-5">
				<H2>Our Focus</H2>
				<div className="flex gap-5 portrait:flex-col">
					<FeatureCard title="Developer Needs" description="We specialize in building high-quality products designed to help developers work faster and reduce repetitive manual workflows." icon={Settings} />
					<FeatureCard title="Digital Products" description="Code Hub always focus on releasing unique and niche solutions that you can find only here, that's where we stand out." icon={Package} />
					<FeatureCard title="Long-Term Support" description="We care more about creating less products and more quality that are maintained with ongoing improvements." icon={Wrench} />
				</div>
			</div>
			<div className="space-y-5">
				<H2>Our Principles</H2>
				<Card>
					<Ul className='list-none *:flex *:gap-2 *:text-base *:items-center my-1'>
						<li><Check size={15} /> Clear documentation</li>
						<li><Check size={15} /> Reliable software</li>
						<li><Check size={15} /> Fair pricing</li>
						<li><Check size={15} /> Customer support</li>
						<li><Check size={15} /> Secured solutions</li>
						<li><Check size={15} /> Privacy first</li>
					</Ul>
				</Card>
			</div>
			<Footer links={[
				{
					link: 'https://discord.gg/RRWYz5gzwx',
					label: 'Discord Community'
				}
			]} />
		</Layout>
	)
}