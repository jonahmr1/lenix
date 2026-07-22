import { ProductItem } from "@/components/articles/product-item"
import { Layout } from "@/components/layout"
import { products } from "@/constants"
import { H1, P } from "../components/typography";
import { CircleAlert } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "~/components/ui/empty";
import { Button } from "~/components/ui/button";

export default () => {
	const productsObj = Object.entries(products)
	return (
		<Layout>
			<div className="flex flex-col items-center">
				<H1>Code Hub Products Catalogue</H1>
				<P>
					Browse our collection of digital software products designed to improve productivity.
				</P>
			</div>
			{productsObj.length
				? (
					<div className="grid grid-cols-3 gap-5 portrait:flex portrait:items-center portrait:flex-col justify-center">
						{productsObj.map(([id, product]) => <ProductItem key={id} {...{ id, ...product }} />)}
					</div>
				) : (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<CircleAlert />
							</EmptyMedia>
							<EmptyTitle>No Products Yet</EmptyTitle>
							<EmptyDescription>
								Code Hub haven&apos;t created any products yet. Get started by creating
								the first one.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent className="flex-row justify-center gap-2">
							<Button>Create Product</Button>
						</EmptyContent>
					</Empty>
				)
			}
		</Layout>
	)
}