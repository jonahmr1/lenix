import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const Legal = () => {
	return (
		<div className="w-full bg-background flex justify-center">
			<div className="flex justify-between flex-col h-full w-2/3">
				<div className="flex justify-evenly flex-col min-h-screen w-full gap-10 py-50">
					<div>
						<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
							Legal Information
						</h1>
						<p className="leading-7 not-first:mt-6">
							Everything you need to know about our terms, privacy practices, and refund policy.
						</p>
					</div>
					<div>
						<h2 id="tos" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
							Terms of Service (ToS)
						</h2>
						<Accordion
							defaultValue={["1"]}
						>
							<AccordionItem value="1">
								<AccordionTrigger>Acceptance of Terms</AccordionTrigger>
								<AccordionContent>
									By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="2">
								<AccordionTrigger>Services</AccordionTrigger>
								<AccordionContent>
									We provide custom software development and related technical services. The scope, timeline, and deliverables are defined individually for each project.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="3">
								<AccordionTrigger>Payments</AccordionTrigger>
								<AccordionContent>
									Payment terms, pricing, and milestones are agreed upon before work begins. Services may require partial or full payment in advance depending on the project.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="4">
								<AccordionTrigger>Intellectual Property</AccordionTrigger>
								<AccordionContent>
									Unless otherwise agreed, ownership of the completed work is transferred to the client upon full payment. We may retain ownership of reusable tools, libraries, and internal frameworks.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="5">
								<AccordionTrigger>Limitation of Liability</AccordionTrigger>
								<AccordionContent>
									We are not liable for indirect, incidental, or consequential damages resulting from the use of our services or delivered software.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="6">
								<AccordionTrigger>Termination</AccordionTrigger>
								<AccordionContent>
									Either party may terminate a project according to the agreed terms. Any completed work and outstanding payments remain due upon termination.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="7">
								<AccordionTrigger>Changes to these Terms</AccordionTrigger>
								<AccordionContent>
									These Terms may be updated periodically. Continued use of our services constitutes acceptance of any revised version.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="8">
								<AccordionTrigger>Contact</AccordionTrigger>
								<AccordionContent>
									If you have questions regarding these Terms, please contact us using the information provided on our website.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
					<div>
						<h2 id="privacy" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
							Privacy Policy
						</h2>
						<Accordion
							defaultValue={["1"]}
						>
							<AccordionItem value="1">
								<AccordionTrigger>Information We Collect</AccordionTrigger>
								<AccordionContent>

								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="2">
								<AccordionTrigger>How We Use Information</AccordionTrigger>
								<AccordionContent>

								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="3">
								<AccordionTrigger>Cookies</AccordionTrigger>
								<AccordionContent>

								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="4">
								<AccordionTrigger>Third-Party Services</AccordionTrigger>
								<AccordionContent>

								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="5">
								<AccordionTrigger>Data Security</AccordionTrigger>
								<AccordionContent>

								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="6">
								<AccordionTrigger>Your Rights</AccordionTrigger>
								<AccordionContent>

								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="7">
								<AccordionTrigger>Contact</AccordionTrigger>
								<AccordionContent>

								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
					<div>
						<h2 id="refunds" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
							Refund Policy
						</h2>
						<Accordion
							defaultValue={["1"]}
						>
							<AccordionItem value="1">
								<AccordionTrigger>Eligibility</AccordionTrigger>
								<AccordionContent>
									Refund eligibility depends on the nature of the service and the stage of the project at the time of the request.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="2">
								<AccordionTrigger>Development Services</AccordionTrigger>
								<AccordionContent>
									Because software development involves custom work, completed milestones and delivered work are generally non-refundable.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="3">
								<AccordionTrigger>Digital Products</AccordionTrigger>
								<AccordionContent>
									Digital products, licenses, and downloadable content are typically non-refundable once delivered, unless required by applicable law.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="4">
								<AccordionTrigger>Requesting a Refund</AccordionTrigger>
								<AccordionContent>
									Refund requests should be submitted promptly with your order details and the reason for your request.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="5">
								<AccordionTrigger>Processing Time</AccordionTrigger>
								<AccordionContent>
									Approved refunds are processed using the original payment method and may take several business days to appear, depending on your payment provider.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Last updated: June 2026.</p>
					</div>
				</div>
			</div>
		</div>
	)
}