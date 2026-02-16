'use client'
import React, { useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface RipplePoint {
  x: number
  y: number
  phase: number
  speed: number
  amplitude: number
}

export const RippleBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const ripplePoints = useRef<RipplePoint[]>([])
  const themeRef = useRef<string>('dark')
  const { theme } = useTheme()

  // Update ref on theme change — no teardown/restart needed
  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize ripple points
    ripplePoints.current = [
      { x: 0.2, y: 0.3, phase: 0, speed: 0.02, amplitude: 0.8 },
      { x: 0.7, y: 0.2, phase: Math.PI, speed: 0.015, amplitude: 0.6 },
      { x: 0.8, y: 0.7, phase: Math.PI / 2, speed: 0.025, amplitude: 0.7 },
      { x: 0.3, y: 0.8, phase: Math.PI * 1.5, speed: 0.018, amplitude: 0.5 },
      { x: 0.5, y: 0.5, phase: Math.PI * 0.7, speed: 0.012, amplitude: 0.4 },
    ]

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Read theme from ref — no dependency on state
      const isDark = themeRef.current === 'dark'

      // Draw interference pattern
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let x = 0; x < canvas.width; x += 2) {
        for (let y = 0; y < canvas.height; y += 2) {
          let interference = 0

          // Calculate interference from all ripple points
          ripplePoints.current.forEach((point) => {
            const dx = x - point.x * canvas.width
            const dy = y - point.y * canvas.height
            const distance = Math.sqrt(dx * dx + dy * dy)
            const wave =
              Math.sin(distance * 0.01 + point.phase) * point.amplitude
            interference += wave / (1 + distance * 0.0001)
          })

          // Normalize interference
          interference = Math.max(0, Math.min(1, (interference + 3) / 6))

          const index = (y * canvas.width + x) * 4
          if (isDark) {
            // Dark theme: cyan/blue tones
            const alpha = interference * 0.25
            data[index] = Math.floor(interference * 0.2 * 255)
            data[index + 1] = Math.floor(interference * 0.8 * 255)
            data[index + 2] = 255
            data[index + 3] = Math.floor(alpha * 255)
          } else {
            // Light theme: soft blue tones visible on light background
            const alpha = interference * 0.18
            data[index] = Math.floor(interference * 0.55 * 255)
            data[index + 1] = Math.floor(interference * 0.65 * 255)
            data[index + 2] = Math.floor(interference * 1.0 * 255)
            data[index + 3] = Math.floor(alpha * 255)
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)

      // Draw ring effects at ripple points
      ripplePoints.current.forEach((point) => {
        const centerX = point.x * canvas.width
        const centerY = point.y * canvas.height

        for (let i = 0; i < 3; i++) {
          const radius =
            (Math.sin(point.phase + i * Math.PI * 0.7) * 0.5 + 0.5) * 150 + 50
          const alpha = (1 - (radius - 50) / 150) * (isDark ? 0.15 : 0.12)

          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
          ctx.strokeStyle = isDark
            ? `rgba(0, 255, 255, ${alpha})`
            : `rgba(59, 130, 246, ${alpha})`
          ctx.lineWidth = isDark ? 1 : 1.5
          ctx.stroke()
        }
      })

      // Update ripple phases
      ripplePoints.current.forEach((point) => {
        point.phase += point.speed
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, []) // Only run once — theme changes picked up via ref

  return (
    <div className="relative min-h-screen">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: 'transparent' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
