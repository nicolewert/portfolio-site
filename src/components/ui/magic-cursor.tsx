'use client'
import { useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  life: number
  maxLife: number
  color: string
}

const LIGHT_COLORS = [
  'rgba(59, 130, 246, 0.9)', // blue
  'rgba(99, 102, 241, 0.9)', // indigo
  'rgba(139, 92, 246, 0.9)', // violet
  'rgba(168, 85, 247, 0.9)', // purple
]

const DARK_COLORS = [
  'rgba(255, 182, 193, 0.9)', // pink
  'rgba(135, 206, 250, 0.9)', // light sky blue
  'rgba(200, 160, 255, 0.9)', // lavender
  'rgba(255, 105, 180, 0.9)', // hot pink
]

const MAX_PARTICLES = 500
const SPAWN_INTERVAL = 30
const MIN_MOVE_DISTANCE = 2

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number
) {
  const points = 4
  const outerRadius = size
  const innerRadius = size * 0.35
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (i * Math.PI) / points - Math.PI / 2
    if (i === 0) {
      ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
    } else {
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
    }
  }
  ctx.closePath()
  ctx.restore()
}

export function MagicCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const lastSpawnRef = useRef(0)
  const animFrameRef = useRef<number>(0)
  const { theme } = useTheme()
  const themeRef = useRef(theme)

  // Keep themeRef in sync without restarting animation
  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  const getColors = useCallback(() => {
    return themeRef.current === 'dark' ? DARK_COLORS : LIGHT_COLORS
  }, [])

  useEffect(() => {
    // Accessibility: disable for reduced motion or touch devices
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    if (prefersReducedMotion || isCoarsePointer) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    const spawnParticles = (now: number) => {
      if (now - lastSpawnRef.current < SPAWN_INTERVAL) return
      const dx = mouseRef.current.x - lastMouseRef.current.x
      const dy = mouseRef.current.y - lastMouseRef.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MIN_MOVE_DISTANCE) return

      lastSpawnRef.current = now
      lastMouseRef.current = { ...mouseRef.current }

      const speed = Math.min(dist, 40)
      const count = Math.min(Math.floor(1 + speed / 15), 4)
      const colors = getColors()

      for (let i = 0; i < count; i++) {
        if (particlesRef.current.length >= MAX_PARTICLES) break
        const angle = Math.random() * Math.PI * 2
        const velocity = 0.3 + Math.random() * 1.2
        particlesRef.current.push({
          x: mouseRef.current.x + (Math.random() - 0.5) * 8,
          y: mouseRef.current.y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 0.3,
          size: 3 + Math.random() * 5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          opacity: 0.7 + Math.random() * 0.3,
          life: 0,
          maxLife: 40 + Math.random() * 30,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    const animate = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      spawnParticles(now)

      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
          continue
        }

        const progress = p.life / p.maxLife
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.01 // slight gravity
        p.rotation += p.rotationSpeed
        p.vx *= 0.99
        p.vy *= 0.99

        const currentOpacity = p.opacity * (1 - progress)
        const currentSize = p.size * (1 - progress * 0.6)

        ctx.globalAlpha = currentOpacity
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.fillStyle = p.color

        drawStar(ctx, p.x, p.y, currentSize, p.rotation)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [getColors])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[5] pointer-events-none"
      aria-hidden="true"
    />
  )
}
