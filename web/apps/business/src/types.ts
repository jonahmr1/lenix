import type { LucideIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import type { Badge } from "@workspace/ui/components/badge"

export interface Faq {
	question: string
	answer: string | ReactNode
}

export type Route = {
	path: string
	icon: LucideIcon
	label?: string
	external?: true
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
export interface Children { children: ReactNode }

// import type { Database } from "./types.database"
// type DbProduct = Database['public']['Tables']['products']['Row']
// export interface Product extends DbProduct {
// 	badges: BadgeItem[]
// }

// type SupabaseBadgeVariant = Database['public']['Enums']['BadgeVariant']
// type SupabaseBadgeAlign = Database['public']['Enums']['BadgeAlignment']
// export interface BadgeItem {
// 	content: string
// 	variant: SupabaseBadgeVariant extends ComponentProps<typeof Badge>['variant'] ? SupabaseBadgeVariant : never
// 	align: SupabaseBadgeAlign
// }
