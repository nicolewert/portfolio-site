import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode
  showRadialGradient?: boolean
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-start bg-zinc-950 text-slate-950 transition-bg min-h-screen w-full overflow-x-hidden',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            `
            [--white-gradient:repeating-linear-gradient(100deg,var(--aurora-white)_0%,var(--aurora-white)_7%,var(--aurora-transparent)_10%,var(--aurora-transparent)_12%,var(--aurora-white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--aurora-black)_0%,var(--aurora-black)_7%,var(--aurora-transparent)_10%,var(--aurora-transparent)_12%,var(--aurora-black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--aurora-1)_10%,var(--aurora-2)_15%,var(--aurora-3)_20%,var(--aurora-2)_25%,var(--aurora-3)_30%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)] 
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
          )}
        ></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  )
}
