import { Layout } from "@/components/layout"
import { P, H1 } from "@/components/typography";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cache } from "@/lib/cache";
import { entries } from "@lenix/lenix";

export default async function Legal() {
	const data = await cache.legal()

	const legals = entries(Object.groupBy(data, item => item.type)).map(([type, items]) => ({
		type,
		items: items ?? [],
	}))
	
  const latest = new Date(Math.max(
		...data.map(self => new Date(self.updated_at).getTime())
	)).toLocaleDateString('en-GB')

	return (
		<Layout>
			<div className="flex flex-col items-center">
				<H1 className="text-accent-foreground">Legal Information</H1>
				<P>
					Everything you need to know about our terms, privacy practices, and refund policy.
				</P>
			</div>
			{legals.map(self => (
				<div className="space-y-5" key={self.type}>
					<h2 id="tos" className="scroll-m-20 text-accent-foreground border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
						{self.type === 'terms' ? 'Terms of Service (ToS)' : self.type === 'privacy' ? 'Privacy Policy' : 'Refund Policy'}
					</h2>
					<Accordion type='single' defaultValue={self.items[0].key}>
						{self.items.map(({ key, value, id }) => (
							<AccordionItem value={key} key={id}>
								<AccordionTrigger className="pt-0 -mt-2 text-accent-foreground">{key}</AccordionTrigger>
								<AccordionContent style={{ marginBlockStart: 0 }} className='text-muted-foreground h-fit pb-2'>{value}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			))}
			<div>
				<p className="text-sm text-muted-foreground">Last updated: {latest}.</p>
			</div>
			<div className="flex w-full justify-center">
				<p className="text-sm text-muted-foreground">All rights reserved © Lenix</p>
			</div>
		</Layout>
	)
}
