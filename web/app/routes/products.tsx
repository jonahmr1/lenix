import { ProductItem } from "@/components/articles/product-item"
import { Layout } from "@/components/layout"
import { products } from "@/constants"
import { H1, P } from "@lenix/lenix"

export default () => {
	return (
		<Layout>
			<div>
				<H1>Developer Products</H1>
				<P>
					Browse our collection of digital software products designed to improve developer productivity. Every purchase includes documentation and support.
				</P>
			</div>
			<div className="grid grid-cols-3 gap-5 portrait:flex portrait:items-center portrait:flex-col justify-center">
				{Object.entries(products).map(([id, product]) => <ProductItem key={id} {...{ id, ...product }} />)}
			</div>
		</Layout>
	)
}