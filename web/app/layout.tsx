import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { RootProvider } from 'fumadocs-ui/provider/next';

import { Source_Sans_3, Oxanium, Geist_Mono } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: 'Lenix',
  description: 'AI & Product Engineer, FiveM Specialist',
	metadataBase: new URL('https://lenix.dev'),
	twitter: {
		card: 'summary_large_image',
  },
}

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
							<Analytics />
						</TooltipProvider>
					</RootProvider>
				</ThemeProvider>
				<Toaster />
      </body>
    </html>
  )
}
