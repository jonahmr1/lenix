import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import type { products } from "./constants"

export interface Faq {
	question: string
	answer: string | ReactNode
}

export type Route = {
	path: string
	element: ReactNode
	icon: LucideIcon
	label?: string
	sub?: {
		id: keyof typeof products
		title: typeof products[keyof typeof products]['title']
		icon: LucideIcon
	}[]
}

export interface FooterLink {
	link: string
	label: string
}

export type ProductSlug = keyof typeof products
export type Product = typeof products[keyof typeof products]
export type Products = Record<ProductSlug, Product>
