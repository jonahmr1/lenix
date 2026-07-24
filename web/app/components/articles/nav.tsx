import { Book, Box, Headset, House, Package, Scale } from "lucide-react";
import { matchPath, useLocation, useNavigate, useFetcher, Link } from "react-router";
import type { loader as productsNavLoader } from "@/routes/products.nav";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

const staticRoutes = [
  { path: "/", label: "Home", icon: House },
  { path: "/products", label: "Products", icon: Package, hasSub: true },
  { path: "/docs", label: "Docs", icon: Book },
  { path: "/contact", label: "Contact", icon: Headset },
  { path: "/legal", label: "Legal", icon: Scale },
]

export const Nav = () => {
  const { pathname } = useLocation()
  const fetcher = useFetcher<typeof productsNavLoader>()

  if (matchPath("/docs/*", pathname) || matchPath("/docs", pathname)) return null

  const productMatch = matchPath("/products/:slug", pathname)
  const isKnownRoute =
    staticRoutes.some(route => matchPath({ path: route.path, end: true }, pathname)) || productMatch

  if (!isKnownRoute) return null

  const products = fetcher.data?.products ?? []
  const visibleSub = products.filter(p => p.id.toString() !== productMatch?.params.slug)

  const loadProductsOnce = () => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/products/nav") // route that returns { products } cheaply
    }
  }

  return (
    <div className="my-5 flex justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          {staticRoutes.map(({ path, icon: Icon, label, hasSub }) => {
            if (!hasSub) {
              return (
                <NavigationMenuItem key={path} className={path === pathname ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}>
                  <NavigationMenuLink
										aria-disabled={path === pathname}
										className={navigationMenuTriggerStyle()}
										render={
											<Link to={path}>
												<Icon className="size-4" />
												<div className="cursor-default">{label}</div>
											</Link>
										}
									>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            }

            return (
              <NavigationMenuItem key={path}>
                <NavigationMenuTrigger
                  className={navigationMenuTriggerStyle()}
                  onMouseEnter={loadProductsOnce}
                  onClick={loadProductsOnce}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="size-4" />
                    <div className="cursor-default">{label}</div>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  {visibleSub.map(({ id, title }) => (
                    <NavigationMenuItem key={`${path}/${id}`}>
                      <NavigationMenuLink
												className={navigationMenuTriggerStyle()}
												render={
													<Link to={`${path}/${id}`}>
														<Box className="size-4" />
														<div className="cursor-default">{title}</div>
													</Link>
												}>
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