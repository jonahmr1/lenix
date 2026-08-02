import { AccordionItems } from "@/components/articles/faqs"
import { Layout } from "@/components/layout"
import { Button } from "@workspace/ui/components/button"
import type { Faq, FooterLink } from "../types"
import { MessageCircle, Check, Package, Settings, Wrench, Euro, type LucideIcon } from "lucide-react"
import { useNavigate } from "react-router"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@workspace/ui/components/card";
import { H1, H2, Muted, P, Ul } from "@/components/typography"
import { ButtonGroup } from "@workspace/ui/components/button-group"

const data: Faq[] = [
	{
		question: 'Do you have any free products?',
		answer: <span>Yes, you can check out all of my free products on <Button className='px-0' variant='link' onClick={() => window.open('https://github.com/jonahmr1', "_blank")}>GitHub</Button></span>
	},
	{
		question: 'What is your refund policy?',
		answer: "Refund requests are handled according to our Refund Policy. If you experience a technical issue that cannot be resolved or the product doesn't match its description, please contact me and I'll fairly review your request."
	},
]


const FeatureCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: LucideIcon }) => (
	<Card>
		<CardHeader className="gap-5">
			<Icon size={32} />
			<CardTitle>{title}</CardTitle>
		</CardHeader>
		<CardContent>
			<CardDescription>{description}</CardDescription>
		</CardContent>
	</Card>
)

export const App = () => {
	const navigate = useNavigate()
	return (
		<Layout>
			<div className="flex flex-col items-center justify-center gap-5">
				<H1>Welcome To Lenix Business</H1>
				<P className="text-center">Lenix develops software products that help developers and business owners work faster and move forward.</P>
				<div className="flex portrait:flex-col gap-3">

					{/* <Button onClick={() => {
						navigate('products')
					}}>View Products</Button> */}
					{/* <Button onClick={() => {
						navigate('/docs')
					}}>Documentation</Button> */}
				</div>
			</div>

			<div className="flex flex-col justify-center">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					Why Lenix?
				</h2>
				<br />
				<div className="flex gap-5 portrait:flex-col">
					<FeatureCard title="Reliability" description="Dependable products built for consistent performance and durability." icon={Wrench} />
					<FeatureCard title="Pricing" description="Fair pricing on every purchase, where every cent is worth paying for." icon={Euro} />
					<FeatureCard title="Support" description="Support is my first philosophic priority, it's what keeps me the best." icon={MessageCircle} />
				</div>
			</div>

			<div className="flex flex-col gap-2 justify-center">
				<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
					FAQ
				</h3>
				<AccordionItems {...{ data }} />
			</div>
			<div className="space-y-5">
				<H1>About Lenix</H1>
				<Muted>
					Lenix develops software for developers,
					communities, and businesses.
					I build digital products that automate
					repetitive tasks, improve workflows, and
					save development time.
				</Muted>
			</div>
			<div className="space-y-5">
				<H2>My Focus</H2>
				<div className="flex gap-5 portrait:flex-col">
					<FeatureCard title="Developer Needs" description="I'm specialized in building high-quality products designed to help developers work faster and reduce repetitive manual workflows." icon={Settings} />
					<FeatureCard title="Digital Products" description="I always focus on releasing unique and niche solutions that you can find only here, that's where I stand out." icon={Package} />
					<FeatureCard title="Long-Term Support" description="I care more about creating less products and more quality that are maintained with ongoing improvements." icon={Wrench} />
				</div>
			</div>
			<div className="space-y-5">
				<H2>My Principles</H2>
				<Card>
					<Ul className='list-none *:flex *:gap-2 *:text-base *:items-center my-1'>
						{
							['Reliable software', 'Clear documentation', 'Fair pricing', 'Customer support', 'Secured solutions', 'Privacy first'].map((v, i) => (
								<li key={i}><Check size={15} /> {v}</li>
							))
						}
					</Ul>
				</Card>
			</div>
		</Layout>
	)
}