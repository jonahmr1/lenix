import { Geist_Mono, Outfit, Oxanium } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { RootProvider } from 'fumadocs-ui/provider/next';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(outfit.variable, oxanium.variable, geistMono.variable)}
    >
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
					<RootProvider>
						{children}
					</RootProvider>
				</ThemeProvider>
				<Toaster />
      </body>
    </html>
  )
}
