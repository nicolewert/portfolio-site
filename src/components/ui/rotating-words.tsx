'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RotatingWordsProps {
  words: string[]
  interval?: number
  className?: string
}

export function RotatingWords({
  words,
  interval = 3000,
  className = '',
}: RotatingWordsProps) {
  const [index, setIndex] = useState(0)
  const [shouldAnimate, setShouldAnimate] = useState(true)

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) {
      setShouldAnimate(false)
      return
    }

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(timer)
  }, [words.length, interval])

  if (!shouldAnimate) {
    return <span className={className}>{words[0]}</span>
  }

  return (
    <span className={`inline-flex overflow-hidden align-baseline ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
