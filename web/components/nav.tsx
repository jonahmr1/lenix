'use client'

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { ListIcon } from "@phosphor-icons/react";

const data = [
	{
		link: 'contact',
		label: 'Contact'
	},
	{
		link: 'docs',
		label: 'Documentations'
	},
	{
		link: 'legal',
		label: 'Legal'
	},
]

export const Nav = () => (
	<NavigationMenu className="absolute left-0 top-0" viewport={false}>
		<NavigationMenuList>
			<NavigationMenuItem>
				<NavigationMenuTrigger>
					<ListIcon />
				</NavigationMenuTrigger>
				<NavigationMenuContent className="inset-s-0">
					{data.map(({ link, label }) => (
						<NavigationMenuLink
							key={label}
							href={link}
							className="no-underline whitespace-nowrap"
							target="_blank"
						>
							{label}
						</NavigationMenuLink>
					))}
				</NavigationMenuContent>
			</NavigationMenuItem>
		</NavigationMenuList>
	</NavigationMenu>
)