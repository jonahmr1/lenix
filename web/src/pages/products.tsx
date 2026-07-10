import { ProductItem } from "@/articles/product-item"
import { H1 } from "@/components/h1"
import { Layout } from "@/components/layout"
import { P } from "@/components/p"
import { products } from "@/constants"

export const Products = () => {
	return (
		<Layout>
			<div>
				<H1>Developer Products</H1>
				<P>
					Browse our collection of digital software products designed to improve developer productivity. Every purchase includes documentation and support.
				</P>
			</div>
			<div className="grid grid-cols-3 gap-5 portrait:flex portrait:items-center portrait:flex-col justify-center">
				{Object.entries(products).map(([id, product]) => <ProductItem {...{ id, ...product }} />)}
			</div>
		</Layout>
	)
}