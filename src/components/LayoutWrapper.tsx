'use client'
import { usePathname } from 'next/navigation'
import { RippleBackground } from '@/components/ui/ripple-background'

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  // Exclude ripple background from AI Nicole page
  const shouldShowRipples = !pathname?.startsWith('/ai-nicole')

  if (shouldShowRipples) {
    return <RippleBackground>{children}</RippleBackground>
  }

  return <>{children}</>
}
