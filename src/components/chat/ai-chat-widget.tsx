'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Sparkles } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-white/20 hover:scale-110 transition-transform duration-200"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ rotate: 15 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] z-50"
          >
            <GlassCard className="flex flex-col h-full bg-zinc-900/90 border-white/10 !p-0 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-white/5">
                <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    AI Nicole
                  </h3>
                  <p className="text-xs text-zinc-400">Ask me anything</p>
                </div>
              </div>

              {/* Chat Area (Placeholder) */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs">AI</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 text-sm text-zinc-200">
                    Hi! I&apos;m Nicole&apos;s AI assistant. I can tell you
                    about her coding skills, experience, or what she&apos;s
                    working on right now.
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/5 bg-white/5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-black/20 border border-white/10 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
