import { ProductItem } from "@/components/articles/product-item"
import { Layout } from "@/components/layout"
import { products } from "~/constants"
import { H1, P, Required } from "../components/typography";
import { CircleAlert, Euro, Minus } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { DrawerHeader, DrawerFooter, Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useEffect, useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import type { BadgeItem, Product } from "~/types";
import { entries } from '@lenix/lenix'
import { useFetcher } from "react-router";
import type { Route } from "./+types/home";
import { createClient } from "../utils/supabase.server";
import { toast } from "sonner";

const badgeVariants = [
	{ label: 'Default', value: 'default' },
	{ label: 'Secondary', value: 'secondary' },
	{ label: 'Outline', value: 'outline' },
	{ label: 'Error', value: 'destructive' },
	{ label: 'Link', value: 'link' },
	{ label: 'Ghost', value: 'ghost' },
] satisfies { label: string, value: BadgeItem['variant'] }[]

const badgeAlignments = {
	left: 'Left',
	right: 'Right'
}

export async function action({ request }: Route.ActionArgs) {
	const { supabase } = createClient(request)
	const { name, desc, price, badges }: Product = await request.json()

	const { data: product, error } = await supabase
		.from('products')
		.insert({ name: name, desc: desc, price: Number(price) })
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

const CreateProduct = () => {
	const [drawer, setDrawer] = useState(false)
	const [loading, setLoading] = useState(false)
	const [{ name, desc, media, price, badges }, setFields] = useState<Product>({
		name: '',
		desc: '',
		media: undefined,
		price: '',
		badges: []
	})
	const fetcher = useFetcher<typeof action>()

	useEffect(() => {
		if (fetcher.data?.success) {
			setFields({
				name: '',
				desc: '',
				media: undefined,
				price: '',
				badges: []
			})
		} else if (fetcher.data?.error) {
			toast.error(fetcher.data?.error)
		}
		setDrawer(false)
		setLoading(false)
	}, [fetcher.data])

	const handleSubmit = async () => {
		setLoading(true)
		fetcher.submit(JSON.stringify({
			name,
			desc,
			price,
			badges,
		}),
			{ method: "post", encType: "application/json" }
		)
	}

	return (
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
				<Drawer
					open={drawer}
					onOpenChange={setDrawer}
					swipeDirection="right"
				>
					<DrawerTrigger render={<Button variant='outline' />}>Create Product</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader className="gap-5">
							<div>
								<DrawerTitle>Create new product</DrawerTitle>
								<DrawerDescription>Please fill in the gaps to publish a new Code Hub product.</DrawerDescription>
							</div>
							<FieldSet>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="name">Name <Required /></FieldLabel>
										<FieldDescription>
											<Input
												value={name}
												onChange={e => setFields(prev => ({ ...prev, name: e.currentTarget.value }))}
												type="text"
												required
											/>
										</FieldDescription>
									</Field>
									<Field>
										<FieldLabel htmlFor="desc">Description <Required /></FieldLabel>
										<FieldDescription>
											<Input
												onChange={e => setFields(prev => ({ ...prev, desc: e.currentTarget.value }))}
												value={desc}
												type="text"
												required
											/>
										</FieldDescription>
									</Field>
									<Field>
										<FieldLabel htmlFor="media">Media <Required /></FieldLabel>
										<FieldDescription>
											<Input
												onChange={e => setFields(prev => ({ ...prev, media: e.currentTarget.files?.[0] }))}
												type="file"
												multiple
												required
											/>
										</FieldDescription>
									</Field>
									<Field>
										<FieldLabel htmlFor="price">Price <Required /></FieldLabel>
										<InputGroup>
											<InputGroupInput
												value={price}
												onChange={e => setFields(prev => ({ ...prev, price: e.currentTarget.value }))}
												type="number"
												required
											/>
											<InputGroupAddon align="inline-end">
												<Euro />
											</InputGroupAddon>
										</InputGroup>
									</Field>
									<Field>
										<FieldLabel>Promotional Badges (optional)</FieldLabel>
										<div className="space-y-2">
											{badges.map(({ content, variant, align }, it) => (
												<Item key={it} variant='outline'>
													<ItemContent className="flex-row gap-5">
														<Input
															value={content}
															onChange={e => {
																setFields(prev => ({
																	...prev,
																	badges: prev.badges.map((badge, i) => i === it ? { ...badge, content: (e.currentTarget as { value: string | null })?.value ?? '' } : badge)
																}))
															}}
															required
															type="text"
															placeholder="label"
														/>
														<Select
															items={badgeVariants}
															defaultValue={badgeVariants[0].value}
															value={variant}
															onValueChange={variant => setFields(prev => ({
																...prev,
																badges: prev.badges.map((badge, i) => i === it ? { ...badge, variant: variant || 'default' } : badge)
															}))}
														>
															<SelectTrigger className="w-full">
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectGroup>
																	<SelectLabel>Variants</SelectLabel>
																	{badgeVariants.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
																</SelectGroup>
															</SelectContent>
														</Select>
														<Select
															items={badgeAlignments}
															defaultValue={badgeAlignments.left}
															value={align}
															onValueChange={align => setFields(prev => ({
																...prev,
																badges: prev.badges.map((badge, i) => i === it ? { ...badge, align: align as BadgeItem['align'] } : badge)
															}))}
														>
															<SelectTrigger className="w-full">
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectGroup>
																	<SelectLabel>Alignment</SelectLabel>
																	{entries(badgeAlignments).map(([align, label]) => <SelectItem key={align} value={align}>{label}</SelectItem>)}
																</SelectGroup>
															</SelectContent>
														</Select>
													</ItemContent>
													<ItemActions>
														<Button
															variant='outline'
															onClick={() => setFields(prev => ({ ...prev, badges: prev.badges.filter((_, i) => i !== it) }))}>
															<Minus />
														</Button>
													</ItemActions>
												</Item>
											))}
											<Button
												className='w-full'
												disabled={badges.length >= 4}
												onClick={() => setFields(prev => ({ ...prev, badges: [...prev.badges, { content: '', variant: 'default', align: 'left' }] }))}
											>Add</Button>
										</div>
									</Field>
								</FieldGroup>
							</FieldSet>
						</DrawerHeader>
						<DrawerFooter>
							<Button
								disabled={loading}
								onClick={handleSubmit}
							>{loading ? 'Submiting...' : 'Submit'}</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</EmptyContent>
		</Empty>
	)
}

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
					<CreateProduct />
				)
			}
		</Layout>
	)
}