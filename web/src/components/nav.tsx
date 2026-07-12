import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "./ui/dropdown-menu";
import { useLocation, useNavigate } from "react-router-dom";
import type { Route } from "@/types";

export const Nav = ({ routes }: { routes: Route[] }) => {
	const navigate = useNavigate()
	const { pathname } = useLocation()
	
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
							<DropdownMenuSub>
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
						) : (<></>))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</nav>
	)
}