'use client'

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { CURRENT_USERNAME } from "@/lib/utils";
import { ListIcon } from "@phosphor-icons/react";

const data = [
	{
		link: 'contact',
		label: 'Contact'
	},
	{
		link: `https://github.com/${CURRENT_USERNAME}`,
		label: 'Github',
		external: true,
	},
	{
		link: 'resume.pdf',
		label: 'Resume'
	},
	{
		link: 'https://buy.polar.sh/polar_cl_ihhMVbNL2cuRAKiafieSfHSXpcaGfSNK0sn1N0zqZtx',
		label: 'Fund',
		external: true,
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
						>
							{label}
						</NavigationMenuLink>
					))}
				</NavigationMenuContent>
			</NavigationMenuItem>
		</NavigationMenuList>
	</NavigationMenu>
)