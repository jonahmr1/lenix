import { ProductItem } from "@/components/articles/product-item"
import { Layout } from "@/components/layout"
import { products } from "@/constants"
import { H1, P, Required } from "../components/typography";
import { CircleAlert, Euro, Minus } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "~/components/ui/empty";
import { Button } from "~/components/ui/button";
import { DrawerHeader, DrawerFooter, Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose } from "~/components/ui/drawer";
import { useState, type ComponentProps } from "react";
import { Input } from "~/components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "~/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Badge } from "~/components/ui/badge";
import { Item, ItemActions, ItemContent } from "~/components/ui/item";
import type { BadgeItem } from "~/types";
import { entries, wait } from '@lenix/lenix'
import { toast } from "sonner";

const badgeVariants = [
	{ label: 'Default', value: 'default' },
	{ label: 'Secondary', value: 'secondary' },
	{ label: 'Outline', value: 'outline' },
	{ label: 'Error', value: 'destructive' },
	{ label: 'Link', value: 'link' },
	{ label: 'Ghost', value: 'ghost' },
] satisfies { label: string, value: ComponentProps<typeof Badge>['variant'] }[]

const badgeAlignments = {
	left: 'Left',
	right: 'Right'
}

const CreateProduct = () => {
	const [drawer, setDrawer] = useState(false)
	const [badges, setBadges] = useState<Record<number, BadgeItem & { align: keyof typeof badgeAlignments }>>({})
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault()
		const form = event.currentTarget

		const data = new FormData(form)
		const [name, desc, media, price] = [
			data.get('name'),
			data.get('desc'),
			data.get('media'),
			data.get('price'),
		]
		
		setLoading(true)
		try {
			await wait(2000)
			toast('Soon...')
		} finally {
			setDrawer(false)
			setLoading(false)
			setBadges({})
			form.reset()
		}
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
							<form id="product" onSubmit={handleSubmit}>
								<FieldSet>
									<FieldGroup>
										<Field>
											<FieldLabel htmlFor="name">Name <Required /></FieldLabel>
											<FieldDescription>
												<Input id="name" name="name" type="text" required />
											</FieldDescription>
										</Field>
										<Field>
											<FieldLabel htmlFor="desc">Description <Required /></FieldLabel>
											<FieldDescription>
												<Input id="desc" name="desc" type="text" required />
											</FieldDescription>
										</Field>
										<Field>
											<FieldLabel htmlFor="media">Media <Required /></FieldLabel>
											<FieldDescription>
												<Input id="media" name="media" type="file"required />
											</FieldDescription>
										</Field>
										<Field>
											<FieldLabel htmlFor="price">Price <Required /></FieldLabel>
											<InputGroup>
												<InputGroupInput id="price" name="price" type="number" required />
												<InputGroupAddon align="inline-end">
													<Euro />
												</InputGroupAddon>
											</InputGroup>
										</Field>
										<Field>
											<FieldLabel>Promotional Badges (optional)</FieldLabel>
											<FieldDescription className="space-y-2">
												{entries(badges).map(([id], i) => (
													<Item key={`${i}_${id}`} variant='outline'>
														<ItemContent className="flex-row gap-5">
															<Input
																name='badge'
																required
																value={badges[id].content}
																onChange={event => setBadges(prev => ({ ...prev, [id]: { ...prev[id], content: event.target.value } }))}
																type="text"
																placeholder="value"
															/>
															<Select
																name='variant'
																items={badgeVariants}
																defaultValue={badgeVariants[0].value}
																value={badges[id].variant}
																onValueChange={variant => setBadges(prev => ({ ...prev, [id]: { ...prev[id], variant } }))}
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
																name='align'
																items={badgeAlignments}
																defaultValue={badgeAlignments.left}
																value={badges[id].align}
																onValueChange={align => setBadges(prev => ({ ...prev, [id]: { ...prev[id], align: align as 'left' | 'right' } }))}
															>
																<SelectTrigger className="w-full">
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectGroup>
																		<SelectLabel>Alignment</SelectLabel>
																		{entries(badgeAlignments).map(([alignment, label]) => <SelectItem key={alignment} value={alignment}>{label}</SelectItem>)}
																	</SelectGroup>
																</SelectContent>
															</Select>
														</ItemContent>
														<ItemActions>
															<Button
																variant='outline'
																onClick={() => setBadges(prev => {
																	const {[id]: _, ...rest} = prev
																	return rest
																})}
															>
																<Minus />
															</Button>
														</ItemActions>
													</Item>
												))}
												<Button className='w-full' disabled={entries(badges).length >= 4} onClick={() => entries(badges).length < 4 && setBadges(prev => ({ ...prev, [Math.max(...Object.keys(prev).map((id) => Number(id)), 0) + 1]: { content: '', variant: 'default', align: 'left' } }))}>Add</Button>
											</FieldDescription>
										</Field>
									</FieldGroup>
								</FieldSet>
							</form>
						</DrawerHeader>
						<DrawerFooter>
							<Button type="submit" form="product" disabled={loading}>{loading ? 'Submiting...' : 'Submit'}</Button>
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