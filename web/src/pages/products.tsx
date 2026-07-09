import { Faq } from "@/components/articles/faq"
import { Footer } from "@/components/articles/footer"
import { Hero } from "@/components/articles/hero"
import { Pricing } from "@/components/articles/products"

export const Products = () => {
	return (
		<div className="w-full bg-background flex justify-center">
			<div className="flex justify-between flex-col h-full w-2/3">
				<div className="flex justify-evenly flex-col min-h-screen w-full gap-10 py-50">
					<Hero />
					<Pricing />
					<Faq />
				</div>
				<Footer className="w-full" items={[
					{ label: 'Legal', url: '/products/legal', replace: true },
					{ label: 'Contact', url: '/contact', replace: true }
				]} />
			</div>
		</div>
	)
}