import type { LucideIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
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
		id: string
		title: string
		icon: LucideIcon
	}[]
}

export interface FooterLink {
	link: string
	label: string
}

type DbProduct = Database['public']['Tables']['products']['Row']
export interface Product extends DbProduct {
	name: string
	desc: string
	price: number
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
