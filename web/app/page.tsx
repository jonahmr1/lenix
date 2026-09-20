import { Layout } from "@/components/layout";
import { Nav } from "@/components/nav";
import { H1, Lead, Muted } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cache } from "@/lib/cache";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { connection } from "next/server";


const LinkButton = ({ children, link }: { children: React.ReactNode, link: string }) => (
	<Button variant='link' asChild>
		<a href={link} target="_blank" rel="noopener noreferrer">
			{children}
			<ArrowUpRightIcon />
		</a>
	</Button>
)

export default async function Page() {
	await connection()
  const state = await cache.github()

  return (
		<Layout className="items-start">
			<Nav />
			<div className="space-y-5">
				<div className="flex flex-col items-start">
					<H1>Lenix</H1>
					<Lead>Self-taught software engineer</Lead>
					<Muted>AI & Product Engineer / FiveM Specialist / Technical Consultant</Muted>
					<p>{state.updated_at}</p>
				</div>
				<div>
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
				</div>
			</div>
		</Layout>
	)
}