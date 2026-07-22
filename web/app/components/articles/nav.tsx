import { products } from "@/constants";
import { Book, Box, Headset, House, Package, Scale } from "lucide-react";
import { matchPath, useLocation, useNavigate } from "react-router";
import type { Route } from "~/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

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
]

export const Nav = () => {
	const navigate = useNavigate()
	const { pathname } = useLocation()

	if (matchPath("/docs/*", pathname) || matchPath("/docs", pathname)) {
		return null;
	}

	const productMatch = matchPath("/products/:slug", pathname);
	const isKnownRoute =
		routes.some(route => matchPath({ path: route.path, end: true }, pathname)) ||
		productMatch;

	if (!isKnownRoute) {
		return null;
	}

	return (
		<div className="my-5 flex justify-center">
			<NavigationMenu>
				<NavigationMenuList>
					{routes.map(({ path, icon: Icon, label, sub }) => {
						if (!sub) return (
							<NavigationMenuItem key={path} className={path === pathname ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}>
								<NavigationMenuLink
									aria-disabled={true}
									onClick={() => navigate(path)}
									className={navigationMenuTriggerStyle()}
								>
									<Icon className="size-4" />
									<div className="cursor-default">{label}</div>
								</NavigationMenuLink>
							</NavigationMenuItem>
						)

						const visibleSub = sub?.filter(({ id }) => id !== productMatch?.params.slug);

						if (!visibleSub?.length) {
							return (
								<NavigationMenuItem key={path}>
									<NavigationMenuLink
										onClick={() => navigate(path)}
										className={navigationMenuTriggerStyle()}
									>
										<Icon className="size-4" />
										<div className="cursor-default">{label}</div>
									</NavigationMenuLink>
								</NavigationMenuItem>
							)
						}

						return (
							<NavigationMenuItem key={path}>
								<NavigationMenuTrigger
									className={navigationMenuTriggerStyle()}
									onClick={() => navigate(path)}
								>
									<div className="flex items-center gap-1.5">
										<Icon className="size-4" />
										<div className="cursor-default">{label}</div>
									</div>
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									{visibleSub.map(({ id, title, icon: Icon }) => (
										<NavigationMenuItem key={`${path}/${id}`}>
											<NavigationMenuLink
												onClick={() => navigate(`${path}/${id}`)}
												className={navigationMenuTriggerStyle()}
											>
												<Icon />
												<div className="cursor-default">{title}</div>
											</NavigationMenuLink>
										</NavigationMenuItem>
									))}
								</NavigationMenuContent>
							</NavigationMenuItem>
						)
					})}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	)
}
