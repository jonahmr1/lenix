import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from "./ui/dropdown-menu";
import { useLocation, useNavigate } from "react-router-dom";
import type { Route } from "@/types";
import type { ReactNode } from "react";

export const Nav = ({ routes }: { routes: Route[] }) => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
  const filteredRoutes = routes.filter(route => route.path !== pathname || 'hidden' in route) as { path: string, label: string, element: ReactNode }[] satisfies Route[]

	return (
		<nav className="sticky top-0">
			<DropdownMenu>
				<DropdownMenuTrigger className='m-4' render={<Button variant='ghost'><Menu /></Button>} />
				<DropdownMenuContent className="w-40" align="start">
					<DropdownMenuGroup>
						<DropdownMenuLabel>Navigator</DropdownMenuLabel>
						{filteredRoutes.map(({ path, label }) => (
							<DropdownMenuItem key={path} onClick={() => navigate(path)}>
								{label}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</nav>
	)
}