import type { Faq } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const AccordionItems = ({ data }: { data: Faq[] }) => (
	<Accordion>
		{data.map(({ question, answer }, i) => (
			<AccordionItem value={i} key={i}>
				<AccordionTrigger>{question}</AccordionTrigger>
				<AccordionContent className='text-muted-foreground'>{answer}</AccordionContent>
			</AccordionItem>
		))}
	</Accordion>
)