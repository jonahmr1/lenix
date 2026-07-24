import { CircleAlert, Euro, Minus } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { DrawerHeader, DrawerFooter, Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useEffect, useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import type { BadgeItem, Product } from "~/types";
import { entries } from '@lenix/lenix'
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Required } from "../typography";
import type { action } from "@/routes/products";
import { createClient } from "@/utils/supabase.client";

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

export const CreateProduct = () => {
	const [drawer, setDrawer] = useState(false)
	const [loading, setLoading] = useState(false)
	const [{ name, desc, media, price, badges }, setFields] = useState<Partial<Omit<Product, 'media' | 'price'>> & { media: FileList | null, price: string }>({
		name: '',
		desc: '',
		media: null,
		price: '',
		badges: []
	})
	const fetcher = useFetcher<typeof action>()

	useEffect(() => {
		if (!fetcher.data) return
		if (fetcher.data.success) {
			setFields({ name: '', desc: '', media: null, price: '', badges: [] })
			setDrawer(false)
		} else if (fetcher.data.error) {
			toast.error(fetcher.data.error)
		}
		setLoading(false)
	}, [fetcher.data])

	const handleSubmit = async () => {
		try {
			setLoading(true)
			if (!media) throw media
		
			const supabase = createClient()
			const urls = await Promise.all(
				Array.from(media ?? []).map(async file => {
					const path = `${crypto.randomUUID()}-${file.name}`
					const { data, error } = await supabase.storage
						.from('media')
						.upload(path, file)
					if (error) throw error.message
				
					return path
				})
			)

			fetcher.submit(JSON.stringify({
				name,
				desc,
				price,
				badges,
				media: urls
			}), { method: "post", encType: "application/json", action: "/products" })

		} finally {
			setLoading(false)
		}
	}

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
		const value = e.currentTarget.value
		setFields(prev => ({ ...prev, [name]: value }))
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
												onChange={e => handleOnChange(e, 'name')}
												type="text"
												required
											/>
										</FieldDescription>
									</Field>
									<Field>
										<FieldLabel htmlFor="desc">Description <Required /></FieldLabel>
										<FieldDescription>
											<Input
												onChange={e => handleOnChange(e, 'desc')}
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
												onChange={e => {
													const media = e.currentTarget?.files
													return setFields(prev => ({ ...prev, media }))
												}}
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
												onChange={e => handleOnChange(e, 'price')}
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
											{badges.map((_, it) => (
												<Item key={it} variant='outline'>
													<ItemContent className="flex-row gap-5">
														<Input
															value={badges[it].content}
															onChange={e => {
																const content = e.currentTarget?.value ?? ''
																setFields(prev => ({
																	...prev,
																	badges: prev.badges.map((badge, i) => i === it ? { ...badge, content } : badge)
																}))
															}}
															required
															type="text"
															placeholder="label"
														/>
														<Select
															items={badgeVariants}
															defaultValue={badgeVariants[0].value}
															value={badges[it].variant}
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
															value={badges[it].align}
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