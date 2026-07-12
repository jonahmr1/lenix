import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { products } from "@/constants";
import { Book, Box, Headset, House, Menu, Package, Scale, ScrollText, type LucideIcon } from "lucide-react";
import { matchPath, useLocation, useNavigate } from "react-router";
import type { Route } from "~/types";

const routes: Route[] = [
	{ path: "/", label: "Home", icon: House },
	{
		path: "/products",
		label: "Products",
		icon: Package,
		sub: Object.entries(products).map(([id, { title }]) => ({
			id: id as keyof typeof products,
			title,
			icon: Box,
		})),
	},
	{ path: "/docs", label: "Docs", icon: Book },
	{ path: "/contact", label: "Contact", icon: Headset },
	{ path: "/legal", label: "Legal", icon: Scale },
	{ path: "/about", label: "About", icon: ScrollText },
]

export const Nav = () => {
	const navigate = useNavigate()
	const { pathname } = useLocation()

	if (matchPath("/docs/*", pathname) || matchPath("/docs", pathname)) {
		return null;
	}

	const isKnownRoute =
		routes.some(route => matchPath({ path: route.path, end: true }, pathname)) ||
		matchPath("/products/:slug", pathname);

	if (!isKnownRoute) {
		return null;
	}

	return (
		<nav className='sticky top-0'>
			<DropdownMenu>
				<DropdownMenuTrigger className='m-4' render={<Button variant='ghost'><Menu /></Button>} />
				<DropdownMenuContent className="w-40" align="start">
					<DropdownMenuGroup>
						<DropdownMenuLabel>{routes.find(route => route.path === pathname)?.label}</DropdownMenuLabel>
						{routes.map(({ path, icon: Icon, label, sub }) => path !== pathname ? !sub ? (
							<DropdownMenuItem key={path} onClick={() => navigate(path)}>
								<Icon />
								{label}
							</DropdownMenuItem>
						) : (
							<DropdownMenuSub key={path}>
								<DropdownMenuSubTrigger onClick={() => navigate(path)}>
									<Icon />
									{label}
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<DropdownMenuGroup>
											{sub.map(({ id, title, icon: Icon }) => (
												<DropdownMenuItem key={path} onClick={() => navigate(`${path}/${id}`)}>
													<Icon />
													{title}
												</DropdownMenuItem>
											))}
										</DropdownMenuGroup>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						) : (<div key={path}></div>))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</nav>
	)
}
