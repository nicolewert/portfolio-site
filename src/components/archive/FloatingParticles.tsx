'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const particleCount = canvas.width < 768 ? 30 : 50
      particlesRef.current = []

      // Check if dark mode is active
      const isDark = document.documentElement.classList.contains('dark')

      for (let i = 0; i < particleCount; i++) {
        // Different colors and opacity for light vs dark theme
        const colors = isDark
          ? ['#dbe5f5', '#b3c7e6', '#94a3b8', '#3b5bdb', '#232b3a', '#ffffff'] // Dark theme colors: foreground, primary, secondary, accent, card, white
          : ['#7984dc', '#93a3e0', '#adb7e4', '#ffffff', '#f8fafc', '#fefefe'] // Light blues and white variations for snow effect

        const baseOpacity = isDark ? 0.2 : 0.6 // More subtle opacity for dark, lower for light theme visibility
        const opacityRange = isDark ? 0.3 : 0.5 // Different opacity ranges

        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 4 + 1, // Slightly larger particles for better visibility
          opacity: Math.random() * opacityRange + baseOpacity,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createParticles()
    animate()

    const debounce = (func: Function, wait: number) => {
      let timeout: NodeJS.Timeout
      return function executedFunction(...args: unknown[]) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    }

    const handleResize = () => {
      const oldWidth = canvas.width
      const oldHeight = canvas.height

      resizeCanvas()

      // Only adjust particle count if screen size category changed
      const newParticleCount = canvas.width < 768 ? 30 : 50
      const currentParticleCount = particlesRef.current.length

      if (newParticleCount !== currentParticleCount) {
        createParticles()
      } else {
        // Scale existing particles to new canvas dimensions
        particlesRef.current.forEach((particle) => {
          particle.x = (particle.x / oldWidth) * canvas.width
          particle.y = (particle.y / oldHeight) * canvas.height
        })
      }
    }

    const handleThemeChange = () => {
      createParticles()
    }

    // Observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          handleThemeChange()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const debouncedResize = debounce(handleResize, 150)
    window.addEventListener('resize', debouncedResize)

    return () => {
      window.removeEventListener('resize', debouncedResize)
      observer.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  )
}
