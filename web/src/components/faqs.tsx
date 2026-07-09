import type { Faq } from "@/types";
import { AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export const AccordionItems = ({ data }: { data: Faq[] }) =>
data.map(({ question, answer }, i) => (
	<AccordionItem value={i} key={i}>
		<AccordionTrigger>{question}</AccordionTrigger>
		<AccordionContent>{answer}</AccordionContent>
	</AccordionItem>
))