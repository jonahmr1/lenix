import { Layout } from "@/components/layout";
import { H1, Lead, Muted, P } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { CURRENT_USERNAME } from "@/lib/github";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const payLink = 'https://buy.polar.sh/polar_cl_ihhMVbNL2cuRAKiafieSfHSXpcaGfSNK0sn1N0zqZtx'

const LinkButton = ({ children, link }: { children: React.ReactNode, link: string }) => (
	<Button variant='link' asChild>
		<a href={link} target="_blank" rel="noopener noreferrer">
			{children}
			<ArrowUpRightIcon />
		</a>
	</Button>
)

export default async function Page() {
  // const state = await cache.github()

  return (
		<Layout className="items-start">
			<div className="space-y-5">
				<div className="place-items-start">
					<H1>Lenix</H1>
					<Lead>Self-taught software engineer</Lead>
					<Muted>AI & Product Engineer / FiveM Specialist / Technical Consultant</Muted>
				</div>
				<div>
					{/* Niche solutions
  Quality over quantity
  Reliablity.
  High-quality only
  Privacy & Security by design.
  Performance first
  Clean code & documentation
	
					<Button>
						<Link href='contact'>Get in touch</Link>
					</Button>
					<Button variant='secondary'>
						<Link href='resume.pdf'>Resume</Link>
					</Button>
					<LinkButton link={`https://github.com/${CURRENT_USERNAME}`}>
						My work
					</LinkButton>
					<Button variant='ghost'>
						<Link href='docs'>Docs</Link>
					</Button>
					<LinkButton link={payLink}>
						Fund
					</LinkButton> */}
				</div>
			</div>
		</Layout>
	)
}