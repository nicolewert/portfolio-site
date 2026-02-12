import type { Metadata } from 'next'
import { Geist, Inter } from 'next/font/google'
import '../styles/globals.css'
import { FloatingDock } from '@/components/ui/floating-dock'
import { AIChatWidget } from '@/components/chat/ai-chat-widget'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LayoutWrapper } from '@/components/LayoutWrapper'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Nicole Wert',
  description:
    'Portfolio website of Nicole Wert – Software Engineer, creative technologist, and problem solver. Explore projects, technical skills, and experience in web development, cloud, and GenAI.',
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    interactiveWidget: 'resizes-content',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${inter.variable} antialiased bg-[var(--background)]`}
      >
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <FloatingDock />
          <AIChatWidget />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
