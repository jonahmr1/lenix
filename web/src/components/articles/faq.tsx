import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function Faq() {
  return (
    <div className="flex flex-col gap-2">
			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
				FAQ
			</h3>
			<Accordion
				type="single"
				collapsible
				defaultValue="1"
			>
				<AccordionItem value="1">
					<AccordionTrigger>Is this a one-time purchase?</AccordionTrigger>
					<AccordionContent>
						Yes. All products are sold as a one-time purchase unless otherwise stated on the product page. There are no recurring subscription fees.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="2">
					<AccordionTrigger>How do I download the product?</AccordionTrigger>
					<AccordionContent>
						After your payment is successfully processed, you'll receive access to download your product along with any applicable license key and installation instructions.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="3">
					<AccordionTrigger>Will I receive updates?</AccordionTrigger>
					<AccordionContent>
						Yes. Every purchase includes free updates within the supported version of the product. Major upgrades, if released separately, may require a new license.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="4">
					<AccordionTrigger>What platforms are supported?</AccordionTrigger>
					<AccordionContent>
						Supported platforms vary by product. Each product page clearly lists its compatibility, system requirements, and installation instructions before purchase.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="5">
					<AccordionTrigger>What is your refund policy?</AccordionTrigger>
					<AccordionContent>
						Refund requests are handled according to our Refund Policy. If you experience a technical issue that cannot be resolved or the product doesn't match its description, please contact us and we'll review your request.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
  )
}
