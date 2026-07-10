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

const routes: IRoute[] = [
  { path: "/", label: "Home", element: <App /> },
  { path: "/legal", label: "Legal", element: <Legal /> },
  { path: "/products", label: "Products", element: <Products /> },
]

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
			<BrowserRouter>
				<Nav routes={routes} />
				<Routes>
					{routes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
					<Route path="*" element={<App/>} />
				</Routes>
			</BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
