import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Legal } from "./pages/legal.tsx"
import { App } from "./pages/app.tsx"
import { Nav } from "./components/nav.tsx"
import type { Route as IRoute } from "./types.ts"
import { Products } from "./pages/products.tsx"
import { Product } from "./pages/product.tsx"
import { Contact } from "./pages/contact.tsx"
import { About } from "./pages/about.tsx"
import { NotFound } from "./404.tsx"
import { Box, Headset, House, Package, Scale, ScrollText } from "lucide-react"
import { products } from "./constants.tsx"
import { entries } from "lenix"

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
				<Nav routes={routes} />
				<Routes>
					{routes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
					<Route path={"/products/:slug"} element={<Product />} />
					<Route path={"*"} element={<NotFound />} />
				</Routes>
			</BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
