'use client'

import React, { useState } from 'react'
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
import { AIChatWidget } from '@/components/chat/ai-chat-widget'

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#lab', label: 'Lab', icon: Beaker },
  { href: '/#journey', label: 'Journey', icon: Map },
  { href: '/blog', label: 'Blog', icon: BookOpen },
]

export const FloatingDock = () => {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      <AIChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/80 dark:border-white/5 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-900/5 dark:ring-white/5">
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
                className="relative group p-2 rounded-full transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/5"
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
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-zinc-500 group-hover:text-slate-800 dark:group-hover:text-zinc-200'
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

          {/* AI Chat Toggle Button */}
          <button
            onClick={() => setChatOpen((prev) => !prev)}
            className="relative group p-2 rounded-full transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label="AI"
          >
            <motion.div
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <MessageSquareText
                size={18}
                className={cn(
                  'transition-colors duration-300',
                  chatOpen
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-zinc-500 group-hover:text-slate-800 dark:group-hover:text-zinc-200'
                )}
              />

              {/* Tooltip */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap backdrop-blur-sm border border-white/10">
                AI
              </span>

              {chatOpen && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
              )}
            </motion.div>
          </button>

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
    </>
  )
}
