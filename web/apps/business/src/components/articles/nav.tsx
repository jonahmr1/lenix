import { Book, Headset, House, Menu, MessagesSquare, MoveUpRight, Scale } from "lucide-react";
import { matchPath, useLocation, useNavigate } from "react-router";
import type { Route } from "@/types";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";

export const Nav = (/* { products }: { products: { id: number; title: string }[] } */) => {
	const navigate = useNavigate()
	const { pathname } = useLocation()

	if (matchPath("/docs/*", pathname) || matchPath("/docs", pathname)) {
		return null;
	}

	const routes: Route[] = [
		{ path: "/", label: "Home", icon: House },
		// {
		// 	path: "/products",
		// 	label: "Products",
		// 	icon: Package,
		// 	sub: products.map(({ id, title }) => ({
		// 		id: id.toString(),
		// 		title,
		// 		icon: Box,
		// 	})),
		// },
		{ path: "/docs", label: "Docs", icon: Book, external: true },
		{ path: "https://lenix.dev/contact", label: "Contact", icon: Headset, external: true },
		{ path: "https://discord.gg/FDp3UZqCtQ", label: "Discord", icon: MessagesSquare, external: true },
		{ path: "/legal", label: "Legal", icon: Scale },
	]

	const productMatch = matchPath("/products/:slug", pathname);
	const isKnownRoute =
		routes.some(route => matchPath({ path: route.path, end: true }, pathname)) ||
		productMatch;

	if (!isKnownRoute) {
		return null;
	}

	const Navbar = () => routes.map(({ path, icon: Icon, label, sub, external }) => {
		if (!sub) return (
			<NavigationMenuItem
				key={path}
				className={path === pathname ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
			>
				<NavigationMenuLink
					aria-disabled={true}
					onClick={() => external ? window.open(path, '_blank') : navigate(path)}
					className={navigationMenuTriggerStyle()}
				>
					<Icon className="size-4" />
					<div className="cursor-default">{label}</div>
					{external && <MoveUpRight />}
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
	})

	return (
		<div className="py-5 flex justify-center portrait:justify-start bg-background">
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem className="landscape:hidden px-2">
						<NavigationMenuTrigger>
							<Menu />
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<Navbar />
						</NavigationMenuContent>
					</NavigationMenuItem>
					<div className="portrait:hidden flex gap-2">
						<Navbar />
					</div>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	)
}