import { AccordionItems } from "@/articles/faqs"
import { H1 } from "@/components/h1"
import { Layout } from "@/components/layout"
import { P } from "@/components/p"
import { Accordion } from "@/components/ui/accordion"
import type { Faq } from "@/types"

export const Legal = () => {
	const tos: Faq[] = [
		{
			question: 'Acceptance of Terms',
			answer: 'By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.'
		},
		{
			question: 'Services',
			answer: 'We provide custom software development and related technical services. The scope, timeline, and deliverables are defined individually for each project.'
		},
		{
			question: 'Payments',
			answer: 'Payment terms, pricing, and milestones are agreed upon before work begins. Services may require partial or full payment in advance depending on the project.'
		},
		{
			question: 'Intellectual Property',
			answer: 'Unless otherwise agreed, ownership of the completed work is transferred to the client upon full payment. We may retain ownership of reusable tools, libraries, and internal frameworks.'
		},
		{
			question: 'Limitation of Liability',
			answer: 'We are not liable for indirect, incidental, or consequential damages resulting from the use of our services or delivered software.'
		},
		{
			question: 'Termination',
			answer: 'Either party may terminate a project according to the agreed terms. Any completed work and outstanding payments remain due upon termination.'
		},
		{
			question: 'Changes to these Terms',
			answer: 'These Terms may be updated periodically. Continued use of our services constitutes acceptance of any revised version.'
		},
		{
			question: 'Contact',
			answer: 'If you have questions regarding these Terms, please contact us on support@lenix.dev.'
		},
		{
			question: 'License',
			answer: 'Unless otherwise stated, purchasing a product grants you a non-exclusive, non-transferable license to use the software. You may not redistribute, resell, or claim ownership of the product.'
		},
		{
			question: 'Acceptable Use',
			answer: 'You may not use our products for unlawful purposes, redistribute them without permission, or attempt to bypass licensing or security mechanisms.'
		},
		{
			question: 'Governing Law',
			answer: 'These Terms are governed by the laws of Algeria unless otherwise required by applicable consumer protection laws.'
		}
	]
	const privacy: Faq[] = [
		{
			question: 'Information We Collect',
			answer: 'We collect information you provide directly (name, email, project details) and automatically (IP address, browser type, pages visited). This helps us understand your needs and improve our services.'
		},
		{
			question: 'How We Use Information',
			answer: 'We use your information to provide services, communicate project updates, process payments, and improve our offerings. We do not sell or share your data with third parties without consent.'
		},
		{
			question: 'Cookies',
			answer: 'We use cookies to enhance your browsing experience and analyze site usage. You can control cookie settings in your browser preferences.'
		},
		{
			question: 'Third-Party Services',
			answer: 'We may use third-party services (payment processors, analytics) that have their own privacy policies. Third-party services process data according to their own privacy policies.'
		},
		{
			question: 'Data Security',
			answer: 'We implement industry-standard security measures to protect your information. However, no method is 100% secure. We are not liable for unauthorized access beyond our control.'
		},
		{
			question: 'Your Rights',
			answer: 'You have the right to access, update, or request deletion of your personal information. Contact us to exercise these rights.'
		},
		{
			question: 'Contact',
			answer: 'For privacy concerns or data requests, please contact us using the information provided on our website.'
		},
		{
			question: 'Data Retention',
			answer: 'We retain personal information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.'
		}
	]
	const refund: Faq[] = [
		{
			question: 'Eligibility',
			answer: 'Refund eligibility depends on the nature of the service and the stage of the project at the time of the request.'
		},
		{
			question: 'Development Services',
			answer: 'Because software development involves custom work, completed milestones and delivered work are generally non-refundable.'
		},
		{
			question: 'Digital Products',
			answer: 'Digital products are generally non-refundable once the download or license has been delivered, except where required by applicable law or where the product is defective or materially differs from its description.'
		},
		{
			question: 'Requesting a Refund',
			answer: 'Refund requests should be submitted promptly with your order details and the reason for your request.'
		},
		{
			question: 'Processing Time',
			answer: 'Approved refunds are processed using the original payment method and may take several business days to appear, depending on your payment provider.'
		},
	]

	return (
		<Layout>
			<div>
				<H1>Legal Information</H1>
				<P>
					Everything you need to know about our terms, privacy practices, and refund policy.
				</P>
			</div>
			<div>
				<h2 id="tos" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					Terms of Service (ToS)
				</h2>
				<AccordionItems data={tos} />
			</div>
			<div>
				<h2 id="privacy" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					Privacy Policy
				</h2>
				<AccordionItems data={privacy} />
			</div>
			<div>
				<h2 id="refunds" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
					Refund Policy
				</h2>
				<AccordionItems data={refund} />
			</div>
			<div>
				<p className="text-sm text-muted-foreground">Last updated: Jul 9th 2026.</p>
			</div>
		</Layout>
	)
}