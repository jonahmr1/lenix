import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cache } from '@/lib/cache'
import { entries } from '@lenix/lenix'

export const metadata = {
	title: 'Lenix ·݀ Legal',
	alternates: { canonical: 'https://lenix.dev/legal' },
}

export default async function Legal() {
	const data = await cache.legal()

	const legals = entries(Object.groupBy(data, (item) => item.type)).map(([type, items]) => ({
		type,
		items: items ?? [],
	}))

	const latest = new Date(Math.max(...data.map((self) => new Date(self.updated_at).getTime()))).toLocaleDateString('en-GB')

	return (
		<Layout>
			<div className="flex flex-col items-center">
				<h1>Legal Information</h1>
				<p>Everything you need to know about my terms, privacy practices, and refund policy.</p>
			</div>
			{legals.map((self) => (
				<Reveal className="space-y-5" key={self.type}>
					<h2 id="tos" className="text-2xl">
						{self.type === 'terms' ? 'Terms of Service (ToS)' : self.type === 'privacy' ? 'Privacy Policy' : 'Refund Policy'}
					</h2>
					<Accordion type="single" defaultValue={self.items[0].key}>
						{self.items.map(({ key, value, id }) => (
							<AccordionItem value={key} key={id}>
								<AccordionTrigger className="pt-0 -mt-2">{key}</AccordionTrigger>
								<AccordionContent style={{ marginBlockStart: 0 }} className="text-muted-foreground h-fit pb-2">
									{value}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</Reveal>
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
