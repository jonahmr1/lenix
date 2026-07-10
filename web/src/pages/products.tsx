import { ProductItem } from "@/articles/product-item"
import { H1 } from "@/components/h1"
import { Layout } from "@/components/layout"
import { P } from "@/components/p"
import type { Product } from "@/types"
import { useNavigate } from "react-router-dom"

export const Products = () => {
	const navigate = useNavigate()
	const products: Product[] = [
		{
			img: '/logo.png',
			title: 'Discord Bot',
			badges: ['Rust', 'AI'],
			feature: 'Sold out',
			description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi nesciunt',
			price: 19.99,
			onClick: () => {
				navigate('/product')
			}
		},
	]
	return (
		<Layout>
			<div>
				<H1>Developer Products</H1>
				<P>
					Browse our collection of digital software products designed to improve developer productivity. Every purchase includes documentation and support.
				</P>
			</div>
			<div className="grid grid-cols-3 gap-5 portrait:flex portrait:items-center portrait:flex-col justify-center">
				{products.map(product => <ProductItem {...{ ...product }} />)}
			</div>
		</Layout>
	)
}