import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'

import { Source_Sans_3, Oxanium, Geist_Mono } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'

const oxaniumHeading = Oxanium({
  subsets: ['latin'],
  variable: '--font-heading',
})
const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans-3',
})
const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Lenix',
  description: 'AI Engineer',
  metadataBase: new URL('https://lenix.dev'),
	openGraph: {
    title: "Discover more about the unique",
    description: "Step into a space shaped by curiosity and a different way of thinking.",
    url: "https://lenix.dev/",
    siteName: "Lenix",
    images: [{ url: "https://lenix.dev/og.png", width: 1200, height: 630, alt: "Discover more about the unique" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover more about the unique",
    description: "Step into a space shaped by curiosity and a different way of thinking.",
    images: ["https://lenix.dev/og.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(
        sourceSans3.variable,
        oxanium.variable,
        geistMono.variable,
        oxaniumHeading.variable
      )}
    >
      <body className='typeset typeset-docs flex min-h-screen flex-col bg-[#a0ffed]'>
        <div className='bg-background'>
          <ThemeProvider enableSystem>
            <TooltipProvider>
              {children}
              <Analytics />
            </TooltipProvider>
          </ThemeProvider>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
