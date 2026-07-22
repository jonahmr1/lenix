import { FeatureCard } from "@/components/articles/card"
import { AccordionItems } from "@/components/articles/faqs"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import type { Faq } from "@/types"
import { Book, MessageCircle, Check, Package, Settings, Wrench } from "lucide-react"
import { useNavigate } from "react-router"
import { Footer } from "~/components/articles/footer"
import { Card } from "@/components/ui/card";
import { H1, H2, H3, P, Ul } from "~/components/typegraphy"

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

export default () => {
	const navigate = useNavigate()
	return (
		<Layout>
			<div className="flex flex-col items-center justify-center gap-5">
				<H1>Software built for developers.</H1>
				<P>Code Hub develops digital tools, extensions, and utilities that help developers work faster. Every product is delivered digitally and includes documentation and support.</P>
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
					<FeatureCard title="Digital Delivery" description="Products are delivered electronically after purchase." icon={Package} />
					<FeatureCard title="Documentation" description="Every product includes installation and usage guides." icon={Book} />
					<FeatureCard title="Support" description="Email support is available for all customers." icon={MessageCircle} />
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
					<FeatureCard title="Developer Tools" description="Software built to improve everyday development." icon={Settings} />
					<FeatureCard title="Digital Products" description="Lifetime licenses with documentation and updates." icon={Package} />
					<FeatureCard title="Long-Term Support" description="Maintained products with ongoing improvements." icon={Wrench} />
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
						<li><Check size={15} /> Privacy first</li>
					</Ul>
				</Card>
			</div>
			<div className="space-y-5">
				<H2>How We Work</H2>
				<Card className="p-4">
					<P>
						Every product is designed, developed, tested,
						and documented before release.
						<br />
						After purchase, customers receive immediate
						access to the product together with installation
						instructions and future updates where applicable.
					</P>
				</Card>
			</div>
			<Card className="p-4 flex flex-col items-start">
				<H3>Need Help?</H3>
				<P>
					Questions before purchasing?
					<br />
					Visit our Contact page and we'll be happy to help.
				</P>
				<Button onClick={() => {
					navigate('/contact')
				}}>Contact Us</Button>
			</Card>
			<Footer links={[
				{
					link: 'https://discord.gg/RRWYz5gzwx',
					label: 'Discord Community'
				}
			]} />
		</Layout>
	)
}