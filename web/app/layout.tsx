import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { RootProvider } from 'fumadocs-ui/provider/next';

import { Source_Sans_3, Oxanium, Geist_Mono } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip";

const oxaniumHeading = Oxanium({subsets:['latin'],variable:'--font-heading'});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
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
      className={cn(sourceSans3.variable, oxanium.variable, geistMono.variable, oxaniumHeading.variable)}
    >
      <body className="flex flex-col min-h-screen typeset typeset-docs">
        <ThemeProvider>
					<RootProvider>
						<TooltipProvider>
							{children}
						</TooltipProvider>
					</RootProvider>
				</ThemeProvider>
				<Toaster />
      </body>
    </html>
  )
}
