import { FeatureCard } from "@/components/articles/card";
import { H1 } from "@/components/h1";
import { H2 } from "@/components/h2";
import { H3 } from "@/components/h3";
import { Layout } from "@/components/layout";
import { Lead } from "@/components/lead";
import { P } from "@/components/p";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ul } from "@/components/ul";
import { Check, Package, Settings, Wrench } from "lucide-react";
import { useNavigate } from "react-router";

export default () => {
	const navigate = useNavigate()
	return (
		<Layout>
			<div className="space-y-5">
				<H1>About Code Hub</H1>
				<Lead>
					Code Hub develops software for developers,
					communities, and businesses.
				</Lead>
				<P>
					We build digital products that automate
					repetitive tasks, improve workflows, and
					save development time.
				</P>
			</div>
			<div className="space-y-5">
				<H2>Our Focus</H2>
				<div className="flex gap-5">
					<FeatureCard title="Developer Tools" description="Software built to improve everyday development." icon={Settings} />
					<FeatureCard title="Digital Products" description="Lifetime licenses with documentation and updates." icon={Package} />
					<FeatureCard title="Long-Term Support" description="Maintained products with ongoing improvements." icon={Wrench} />
				</div>
			</div>
			<div className="space-y-5">
				<H2>Our Principales</H2>
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
		</Layout>
	);
}