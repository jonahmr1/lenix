import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Legal } from "./pages/legal.tsx"
import { App } from "./pages/app.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="*" element={<App />} />
					<Route path="/legal" element={<Legal />} />
				</Routes>
			</BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
