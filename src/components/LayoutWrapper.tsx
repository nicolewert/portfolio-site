'use client'
import { GradientBackground } from '@/components/ui/gradient-background'

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return <GradientBackground>{children}</GradientBackground>
}
