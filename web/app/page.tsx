import { Layout } from "@/components/layout";
import { Nav } from "@/components/nav";
import { Stats } from "@/components/stats";
import { H1, Lead, Muted } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CURRENT_USERNAME } from "@/lib/utils";
import { CodeIcon, CreditCardIcon, FileTextIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const buttons = [
	{
		label: 'Fund',
		link: 'https://buy.polar.sh/polar_cl_ihhMVbNL2cuRAKiafieSfHSXpcaGfSNK0sn1N0zqZtx',
		icon: <CreditCardIcon />
	},
	{
		label: 'Hands On Experience',
		link: `https://github.com/${CURRENT_USERNAME}`,
		icon: <CodeIcon />
	},
	{
		label: 'Resume',
		link: 'resume.pdf',
		icon: <FileTextIcon />
	},
]

export default async function Page() {
	return (
		<Layout className="pt-0">
			<Nav />
			<div className="flex flex-col justify-center gap-10 min-h-screen">
				<div className="flex flex-col items-start">
					<Muted className="tracking-widest opacity-60 font-light">01 / Introduction</Muted>
					<H1 className="text-primary">Lenix</H1>
					<Lead>Self-taught software engineer</Lead>
					<Muted className="opacity-50">AI & Product Engineer / FiveM Specialist / Technical Consultant</Muted>
				</div>
				<ButtonGroup className="justify-center w-full">
					{buttons.map(button => (
						<Button key={button.label} variant='outline'>
							<Link className="no-underline" href={button.link}>{button.label}</Link>
							{button.icon}
						</Button>
					))}
				</ButtonGroup>
			</div>
			{/* <Stats /> */}
		</Layout>
	)
}


{/* Niche solutions
Quality over quantity
Reliablity.
High-quality only
Privacy & Security by design.
Performance first
Clean code & documentation
*/}
{/* <a href="https://buy.polar.sh/polar_cl_ihhMVbNL2cuRAKiafieSfHSXpcaGfSNK0sn1N0zqZtx" data-polar-checkout data-polar-checkout-theme="dark">Purchase</a>
<script src="https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js" defer data-auto-init></script> */}