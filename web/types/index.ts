import type { LucideIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import type { products } from "../constants"
import type { Badge } from "@/components/ui/badge"
import type { Database } from "./database"

export interface Faq {
	question: string
	answer: string | ReactNode
}

export type Route = {
	path: string
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

export type Product = {
	name: string
	desc: string
	media: File | undefined
	price: string
	badges: BadgeItem[]
}

export interface Children { children: ReactNode }

type SupabaseBadgeVariant = Database['public']['Enums']['BadgeVariant']
type SupabaseBadgeAlign = Database['public']['Enums']['BadgeAlignment']
export interface BadgeItem {
	content: string
	variant: SupabaseBadgeVariant extends ComponentProps<typeof Badge>['variant'] ? SupabaseBadgeVariant : never
	align: SupabaseBadgeAlign
}
