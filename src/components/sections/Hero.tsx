'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMouseParallax } from '@/lib/useMouseParallax'
import { RotatingWords } from '@/components/ui/rotating-words'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
}

const nameVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 12,
      delay: 0.3,
    },
  },
}

function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return { ref, springX, springY, handleMouseMove, handleMouseLeave }
}

const ROTATING_WORDS = [
  'digital experiences',
  'creative interfaces',
  'delightful apps',
  'cool things',
]

export const Hero = () => {
  const { rotateX, rotateY } = useMouseParallax(8)
  const [reducedMotion, setReducedMotion] = useState(false)

  const exploreBtn = useMagnetic(0.3)
  const journeyBtn = useMagnetic(0.25)

  useEffect(() => {
    setReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 w-full relative">
      <motion.div
        style={
          reducedMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                perspective: 1000,
                transformStyle: 'preserve-3d' as const,
              }
        }
        className="relative z-10 text-center max-w-4xl mx-auto space-y-6"
      >
        <motion.div
          variants={containerVariants}
          initial={reducedMotion ? 'visible' : 'hidden'}
          animate="visible"
          className="space-y-6"
        >
          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-inter font-semibold tracking-tighter text-slate-800 dark:text-white"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
          >
            <span className="font-light italic block md:inline">
              Hi, I&apos;m
            </span>{' '}
            <motion.span
              variants={nameVariants}
              className="inline-block origin-bottom"
            >
              Nicole.
            </motion.span>
          </motion.h1>

          {/* Subtitle with rotating words */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl font-inter font-light text-slate-600 dark:text-zinc-300 max-w-xl mx-auto leading-relaxed"
            style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
          >
            Building{' '}
            <RotatingWords
              words={ROTATING_WORDS}
              className="text-blue-600 dark:text-blue-400 font-normal"
            />{' '}
            that are <br className="hidden md:block" /> fun, professional, and
            unique.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
          >
            <motion.a
              ref={exploreBtn.ref}
              href="#lab"
              onMouseMove={exploreBtn.handleMouseMove}
              onMouseLeave={exploreBtn.handleMouseLeave}
              style={{ x: exploreBtn.springX, y: exploreBtn.springY }}
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-300 flex items-center gap-2 group"
            >
              Explore the Lab
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </motion.a>
            <motion.a
              ref={journeyBtn.ref}
              href="#journey"
              onMouseMove={journeyBtn.handleMouseMove}
              onMouseLeave={journeyBtn.handleMouseLeave}
              style={{ x: journeyBtn.springX, y: journeyBtn.springY }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-full bg-blue-100/90 hover:bg-blue-200 dark:bg-blue-600/15 dark:hover:bg-blue-600/25 border border-blue-300 dark:border-blue-500/50 text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-[background-color,border-color,color] duration-300 shadow-lg"
            >
              See My Journey
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
