import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'base' | 'hover' | 'active'
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, variant = 'base', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'backdrop-blur-xl transition-all duration-300',
          'rounded-2xl',
          // Light Mode - Enhanced for visibility
          'bg-white/98 border-2 border-slate-300 shadow-2xl shadow-blue-100/50',
          // Dark Mode - Restored to original, NO shadows
          'dark:bg-white/5 dark:border-white/10 dark:shadow-none',

          variant === 'hover' &&
            'hover:bg-white hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-200/60 hover:scale-[1.02] cursor-pointer dark:hover:bg-white/10 dark:hover:scale-[1.01] dark:hover:shadow-none dark:hover:border-white/20',
          variant === 'active' &&
            'bg-white border-blue-400 shadow-2xl shadow-blue-200/60 scale-[1.02] dark:bg-white/10 dark:scale-[1.01] dark:shadow-none dark:border-white/20',

          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'
