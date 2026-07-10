import { Faq } from "@/components/articles/faq"
import { Hero } from "@/components/articles/hero"
import { Products } from "@/components/articles/products"

export const App = () => {
	return (
		<div className="w-full bg-background flex justify-center">
			<div className="flex justify-between flex-col h-full w-2/3">
				<div className="flex justify-evenly flex-col min-h-screen w-full gap-10 py-50">
					<Hero />
					<Products />
					<div>
						<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
							Why Code Hub?
						</h2>
						Digital Delivery

						Products are delivered electronically after purchase.
						Documentation

						Every product includes installation and usage guides.
						Support

						Email support is available for all customers.

					</div>
					<Faq />
				</div>
			</div>
		</div>
	)
}