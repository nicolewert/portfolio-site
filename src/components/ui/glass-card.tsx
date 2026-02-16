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
          'transition-[border-color,transform,box-shadow] duration-300 transform-gpu',
          'rounded-2xl',
          // Light Mode - Fully opaque to avoid compositing jank
          'bg-white border-2 border-slate-200/80 shadow-lg shadow-slate-200/40',
          // Dark Mode - Semi-opaque to avoid backdrop-blur flicker from animated canvas
          'dark:bg-[rgba(15,23,42,0.75)] dark:border-white/10 dark:shadow-none',

          variant === 'hover' &&
            'hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 hover:scale-[1.02] cursor-pointer dark:hover:bg-[rgba(15,23,42,0.85)] dark:hover:scale-[1.01] dark:hover:shadow-none dark:hover:border-white/20',
          variant === 'active' &&
            'border-blue-300 shadow-xl shadow-blue-100/50 scale-[1.02] dark:bg-[rgba(15,23,42,0.85)] dark:scale-[1.01] dark:shadow-none dark:border-white/20',

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
