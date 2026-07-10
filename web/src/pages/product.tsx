import { AccordionItems } from "@/articles/faqs"
import { H2 } from "@/components/h2"
import { H3 } from "@/components/h3"
import { Large } from "@/components/large"
import { Layout } from "@/components/layout"
import { Lead } from "@/components/lead"
import { Muted } from "@/components/muted"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ul } from "@/components/ul"
import type { Faq } from "@/types"

const faqs: Faq[] = [
	{
		question: '',
		answer: ''
	},
	{
		question: '',
		answer: ''
	},
	{
		question: '',
		answer: ''
	},
	{
		question: '',
		answer: ''
	},
	{
		question: '',
		answer: ''
	},
]

export const Product = () => {
	return (
		<Layout className="mx-[5vw] py-[20vh]">
			<div className="flex *:flex-col gap-10">
				<div className="flex flex-5 gap-10">
					<div className="flex justify-center">
						<img src="/logo.png" className="aspect-video object-cover" />
					</div>
					<AccordionItems data={faqs} />
				</div>
				<div className="flex-4">
					<div className="flex flex-col gap-10">
						<div className="flex flex-col gap-5">
							<div className="flex gap-2">
								<Badge>Rust</Badge>
								<Badge>AI</Badge>
							</div>
							<div className="flex justify-between w-full">
								<H2>Discord Bot</H2>
								<Large>19.99€</Large>
							</div>
							<Button>Buy Now</Button>
						</div>
						<div>
							<Lead>Description</Lead>
							<Muted>
								Generate customizable receipts for ESX, QBCore and QBox
								<br />
								servers. Built for production use with configurable
								<br />
								templates and framework support.
							</Muted>
						</div>
						<div>
							<Lead>Requirements</Lead>
							<Ul>
								<li>
									<Muted>FiveM Server</Muted>
								</li>
								<li>
									<Muted>ESX / QBCore / QBox</Muted>
								</li>
								<li>
									<Muted>ox_lib</Muted>
								</li>
							</Ul>
						</div>
						<div className="flex flex-col items-start">
							<Lead>Documentation</Lead>
							<Button variant='link'>Installation →</Button>
							<Button variant='link'>Configuration →</Button>
							<Button variant='link'>Examples →</Button>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}