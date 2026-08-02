import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@workspace/ui/globals.css"
import { App } from "./routes/home.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { Toaster } from "@workspace/ui/components/sonner"
import { Nav } from "./components/articles/nav"
import { MemoryRouter, Route, Routes } from "react-router"
import Legal from "./routes/legal.tsx"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="system" storageKey="0">
			<MemoryRouter>
				<Nav />
				<Routes>
					<Route path="/" element={<App />}/>
					<Route path="/legal" element={<Legal />}/>
				</Routes>
			</MemoryRouter>
			<Toaster />
		</ThemeProvider>
	</StrictMode>
)
