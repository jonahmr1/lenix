import { ProductItem } from "@/components/articles/product-item"
import { Layout } from "@/components/layout"
import { products } from "@/constants"
import { H1, P } from "../components/typography";

export default () => {
	return (
		<Layout>
			<div>
				<H1>Code Hub Products Catalogue</H1>
				<P>
					Browse our collection of digital software products designed to improve productivity.
				</P>
			</div>
			<div className="grid grid-cols-3 gap-5 portrait:flex portrait:items-center portrait:flex-col justify-center">
				{Object.entries(products).map(([id, product]) => <ProductItem key={id} {...{ id, ...product }} />)}
			</div>
		</Layout>
	)
}