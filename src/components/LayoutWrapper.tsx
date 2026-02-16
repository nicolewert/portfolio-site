'use client'
import { usePathname } from 'next/navigation'
import { GradientBackground } from '@/components/ui/gradient-background'

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  // Exclude gradient background from AI Nicole page
  const shouldShowGradient = !pathname?.startsWith('/ai-nicole')

  if (shouldShowGradient) {
    return <GradientBackground>{children}</GradientBackground>
  }

  return <>{children}</>
}
