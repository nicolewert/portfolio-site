'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Beaker,
  Map,
  BookOpen,
  MessageSquareText,
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#lab', label: 'Lab', icon: Beaker },
  { href: '/#journey', label: 'Journey', icon: Map },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/ai-nicole', label: 'AI', icon: MessageSquareText },
]

export const FloatingDock = () => {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-white/10 dark:bg-zinc-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/' &&
              pathname.startsWith(link.href.replace('/#', '')))
          const Icon = link.icon

          return (
            <Link
              key={link.label}
              href={link.href}
              className="relative group p-2 rounded-full transition-all duration-300 hover:bg-white/5"
              aria-label={link.label}
            >
              <motion.div
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Icon
                  size={18}
                  className={cn(
                    'transition-colors duration-300',
                    isActive
                      ? 'text-blue-400'
                      : 'text-zinc-500 group-hover:text-zinc-200'
                  )}
                />

                {/* Tooltip */}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap backdrop-blur-sm border border-white/10">
                  {link.label}
                </span>

                {isActive && (
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                )}
              </motion.div>
            </Link>
          )
        })}

        {/* Separator */}
        <div className="w-px h-6 bg-black/10 dark:bg-white/10 mx-1" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative group p-2 rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Toggle Theme"
        >
          <motion.div
            whileHover={{ scale: 1.15, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === 'dark' ? (
              <Sun
                size={18}
                className="text-zinc-400 group-hover:text-yellow-300 transition-colors"
              />
            ) : (
              <Moon
                size={18}
                className="text-zinc-600 group-hover:text-indigo-400 transition-colors"
              />
            )}
          </motion.div>
        </button>
      </div>
    </div>
  )
}
