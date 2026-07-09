import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "./ui/dropdown-menu";
import { Link } from "react-router-dom";
import type { Route } from "@/types";


export const Nav = ({ routes }: { routes: Route[] }) => (
	<nav className="sticky top-0">
		<DropdownMenu>
			<DropdownMenuTrigger className='m-4' render={<Button variant='ghost'><Menu /></Button>} />
			<DropdownMenuContent className="w-40" align="start">
				<DropdownMenuGroup>
					{routes.map(({ path, label }) => (
						<DropdownMenuItem>
							<Link to={path}>{label}</Link>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	</nav>
)