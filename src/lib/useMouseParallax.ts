'use client'

import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export function useMouseParallax(intensity: number = 8) {
  const [isEnabled, setIsEnabled] = useState(false)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rawRotateY = useTransform(mouseX, [0, 1], [-intensity, intensity])
  const rawRotateX = useTransform(mouseY, [0, 1], [intensity, -intensity])

  const rotateX = useSpring(rawRotateX, {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  })
  const rotateY = useSpring(rawRotateY, {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  })

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (isTouch || prefersReduced) return

    setIsEnabled(true)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return { rotateX, rotateY, isEnabled }
}
