'use client'
import React from 'react'
import { MagicCursor } from '@/components/ui/magic-cursor'

export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-[background] duration-700
          bg-[radial-gradient(circle_at_20%_80%,_rgba(0,150,255,0.35),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(180,80,255,0.35),_transparent_40%),radial-gradient(circle_at_50%_0%,_rgba(255,80,150,0.25),_transparent_50%)]
          dark:bg-[radial-gradient(circle_at_20%_80%,_rgba(255,182,193,0.15),_transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(135,206,250,0.12),_transparent_50%),radial-gradient(circle_at_50%_0%,_rgba(200,160,255,0.10),_transparent_55%),radial-gradient(circle_at_50%_50%,_rgba(255,105,180,0.08),_transparent_60%)]"
      />
      <MagicCursor />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
