import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Legal } from "./app/routes/legal"
import { App } from "./app/routes/home"
import { Nav } from "./articles/nav.tsx"
import type { Route as IRoute } from "./types.ts"
import { Products } from "./app/routes/products"
import { Product } from "./app/routes/product"
import { Contact } from "./app/routes/contact"
import { About } from "./app/routes/about"
import { Box, Headset, House, Package, Scale, ScrollText } from "lucide-react"
import { products } from "./constants.tsx"
import { entries } from "lenix"
import { NotFound } from "./app/routes/404"

const routes: IRoute[] = [
	{
		path: "/", element: <App />, label: "Home", icon: House
	},
	{
		path: "/products", element: <Products />, label: "Products", icon: Package,
		sub: entries(products).map(([id, { title }]) => ({
			id,
			title,
			icon: Box
		}))
	},
	{
		path: "/contact", element: <Contact />, label: "Contact", icon: Headset
	},
	{
		path: "/legal", element: <Legal />, label: "Legal", icon: Scale
	},
	{
		path: "/about", element: <About />, label: "About", icon: ScrollText
	},
]

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<BrowserRouter>
				<Routes>
					{routes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
					<Route path={"/products/:slug"} element={<Product />} />
					<Route path={"*"} element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>
)
