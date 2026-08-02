import type { Faq } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";

export const AccordionItems = ({ data }: { data: Faq[] }) => (
	<Accordion type='single'>
		{data.map(({ question, answer }, i) => (
			<AccordionItem value={i.toString()} key={i}>
				<AccordionTrigger>{question}</AccordionTrigger>
				<AccordionContent className='text-muted-foreground'>{answer}</AccordionContent>
			</AccordionItem>
		))}
	</Accordion>
)