import {
	Accordion,
} from "@/components/ui/accordion"
import type { Faq } from "@/types"
import { AccordionItems } from "../faqs"

export function Faq() {
	const data: Faq[] = [
		{
			question: 'Is this a one-time purchase?',
			answer: 'Yes. All products are sold as a one-time purchase unless otherwise stated on the product page. There are no recurring subscription fees.'
		},
		{
			question: 'How do I download the product?',
			answer: "After your payment is successfully processed, you'll receive access to download your product along with any applicable license key and installation instructions."
		},
		{
			question: 'Will I receive updates?',
			answer: 'Yes. Every purchase includes free updates within the supported version of the product. Major upgrades, if released separately, may require a new license.'
		},
		{
			question: 'What platforms are supported?',
			answer: 'Supported platforms vary by product. Each product page clearly lists its compatibility, system requirements, and installation instructions before purchase.'
		},
		{
			question: 'What is your refund policy?',
			answer: "Refund requests are handled according to our Refund Policy. If you experience a technical issue that cannot be resolved or the product doesn't match its description, please contact us and we'll review your request."
		},
	]

	return (
		<div className="flex flex-col gap-2">
			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
				FAQ
			</h3>
			<Accordion>
				<AccordionItems {...{ data }} />
			</Accordion>
		</div>
	)
}
