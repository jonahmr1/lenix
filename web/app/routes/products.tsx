import { ProductItem } from "@/components/articles/product-item"
import { Layout } from "@/components/layout"
import { H1, P } from "../components/typography";
import { CreateProduct } from "../components/articles/create-product";
import type { Route } from "./+types/products";
import { Suspense } from "react";
import type { Product } from "~/types";
import { createClient } from "@/utils/supabase.server";
import { Await } from "react-router";
import { Spinner } from "../components/ui/spinner";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request)
  const productsPromise: Promise<Product[]> = Promise.resolve(
		supabase
		.from('products')
		.select('*, badges(*)')
		.then(async response => {
			const rows = response.data ?? []
			return await Promise.all(
				rows.map(async product => {
					const signedUrls = await Promise.all(
						product.media.map((key) =>
							supabase
							.storage
							.from('media')
							.createSignedUrl(key, 60 * 30)
							.then(({ data }) => data?.signedUrl ?? '')
						)
					)
					return { ...product, media: signedUrls }
				})
			)
		})
	)
  return { products: productsPromise }
}

export async function action({ request }: Route.ActionArgs) {
	const { supabase } = createClient(request)
	const { name, desc, media, price, badges }: Product = await request.json()

	const { data: product, error } = await supabase
		.from('products')
		.insert({ name: name, desc: desc, price: Number(price), media })
		.select()
		.single()
	if (error || !product) return { error: error?.message }

	const badgeRows = badges.map(({ content, variant, align }) => ({
		content,
		variant,
		align,
		product: product.id,
	}))

	if (badgeRows.length) {
		const { error: badgeError } = await supabase.from('badges').insert(badgeRows)
		if (badgeError) return { error: badgeError.message }
	}

	return { success: true }
}

export default function Products({ loaderData }: Route.ComponentProps) {
	return (
		<Layout>
			<div className="flex flex-col items-center">
				<H1>Code Hub Products Catalogue</H1>
				<P>
					Browse our collection of digital software products designed to improve productivity.
				</P>
			</div>
			<Suspense fallback={
				<div className="flex justify-center">
					<Spinner />
				</div>
			}>
				<Await resolve={loaderData.products}>
					{products => products.length
						? <div className="grid grid-cols-3 gap-5 portrait:flex portrait:items-center portrait:flex-col justify-center">
							{products.map((product, i) => <ProductItem key={i} {...product} />)}
						</div>
						: <CreateProduct />
					}
				</Await>
			</Suspense>
		</Layout>
	)
}