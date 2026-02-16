'use client'
import React from 'react'

export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-[background] duration-700
          bg-[radial-gradient(circle_at_20%_80%,_rgba(0,150,255,0.35),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(180,80,255,0.35),_transparent_40%),radial-gradient(circle_at_50%_0%,_rgba(255,80,150,0.25),_transparent_50%)]
          dark:bg-[radial-gradient(circle_at_20%_80%,_rgba(0,255,255,0.08),_transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(139,92,246,0.06),_transparent_50%),radial-gradient(circle_at_50%_0%,_rgba(255,0,128,0.04),_transparent_60%)]"
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
