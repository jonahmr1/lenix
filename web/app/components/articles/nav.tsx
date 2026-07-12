import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import type { Route } from "@/types";
import { Menu } from "lucide-react";
import { matchPath, useLocation, useNavigate } from "react-router";

export const Nav = ({ routes }: { routes: Route[] }) => {
	const navigate = useNavigate()
	const { pathname } = useLocation()

	const isKnownRoute =
		routes.some(route => matchPath({ path: route.path, end: true }, pathname)) ||
		matchPath("/products/:slug", pathname);

	if (!isKnownRoute) {
		return null; // 404, hide nav
	}

	return (
		<nav className='sticky top-0'>
			<DropdownMenu>
				<DropdownMenuTrigger className='m-4' render={<Button variant='ghost'><Menu /></Button>} />
				<DropdownMenuContent className="w-40" align="start">
					<DropdownMenuGroup>
						<DropdownMenuLabel>Navigator</DropdownMenuLabel>
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