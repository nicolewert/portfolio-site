'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'
import { FormattedMessage } from '@/components/chat/FormattedMessage'

interface AIChatWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export const AIChatWidget = ({ isOpen, onClose }: AIChatWidgetProps) => {
  const { theme } = useTheme()
  const [message, setMessage] = useState('')
  const MAX_CHARS = 500
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm Nicole's AI assistant. Ask me anything about her skills, projects, or experience!",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastAssistantRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'assistant' && messages.length > 1) {
      lastAssistantRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim() || message.length > MAX_CHARS) return

    const userMessage = { role: 'user', content: message }
    setMessages((prev) => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ask-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
      })

      const data = await response.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.text },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    }

    setIsLoading(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — click outside to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 w-[calc(100vw-2rem)] max-w-96 h-[min(600px,80vh)] z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden ${
              theme === 'dark'
                ? 'border border-cyan-400/15 ring-1 ring-white/5'
                : 'border border-cyan-200/60 ring-1 ring-cyan-300/20'
            }`}
            style={{
              background: theme === 'dark' ? '#0f172a' : '#ffffff',
            }}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between px-3 py-2.5 border-b ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 border-cyan-400/20'
                  : 'bg-gradient-to-r from-white/80 via-cyan-50/60 to-white/80 border-cyan-400/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Profile Photo */}
                <div className="relative">
                  <div
                    className={`relative w-10 h-10 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-cyan-400/20 to-purple-500/10 border-cyan-400/40'
                        : 'bg-gradient-to-br from-white/70 to-cyan-100/60 border-cyan-400/60'
                    }`}
                  >
                    <div className="absolute inset-1 rounded-lg overflow-hidden">
                      <Image
                        src="/profile_picture.png"
                        alt="Nicole Wert"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover filter brightness-110 contrast-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                    </div>
                    {/* Prismatic corners */}
                    <div
                      className={`absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l rounded-tl-md ${
                        theme === 'dark'
                          ? 'border-cyan-400/80'
                          : 'border-cyan-600/90'
                      }`}
                    />
                    <div
                      className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r rounded-tr-md ${
                        theme === 'dark'
                          ? 'border-purple-400/80'
                          : 'border-purple-600/90'
                      }`}
                    />
                  </div>
                </div>

                {/* Title & Status */}
                <div>
                  <h3
                    className={`text-sm font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                      theme === 'dark'
                        ? 'from-cyan-300 via-white to-purple-300'
                        : 'from-cyan-600 via-slate-800 to-purple-600'
                    }`}
                  >
                    AI Nicole
                  </h3>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        theme === 'dark' ? 'bg-green-400' : 'bg-green-500'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-medium ${
                        theme === 'dark' ? 'text-cyan-300' : 'text-cyan-900'
                      }`}
                    >
                      Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-white/10 text-zinc-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto overflow-x-hidden">
              <div className="flex flex-col space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    ref={
                      index === messages.length - 1 && msg.role === 'assistant'
                        ? lastAssistantRef
                        : undefined
                    }
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[240px] px-3 py-2 rounded-2xl border text-sm break-words ${
                        msg.role === 'user'
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/40 text-cyan-100'
                            : 'bg-gradient-to-r from-cyan-400/30 to-blue-400/30 border-cyan-500/50 text-cyan-800'
                          : theme === 'dark'
                            ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/20 text-purple-100'
                            : 'bg-gradient-to-r from-white/60 to-purple-50/50 border-purple-300/40 text-slate-700'
                      }`}
                      style={{ overflowWrap: 'anywhere' }}
                    >
                      {msg.role === 'assistant' ? (
                        <FormattedMessage content={msg.content} theme={theme} />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div
                      className={`px-3 py-2 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-white/10 border-white/20'
                          : 'bg-white/50 border-slate-200/50'
                      }`}
                    >
                      <div className="flex space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full animate-bounce ${
                            theme === 'dark' ? 'bg-white/60' : 'bg-slate-400'
                          }`}
                        />
                        <div
                          className={`w-2 h-2 rounded-full animate-bounce delay-100 ${
                            theme === 'dark' ? 'bg-white/60' : 'bg-slate-400'
                          }`}
                        />
                        <div
                          className={`w-2 h-2 rounded-full animate-bounce delay-200 ${
                            theme === 'dark' ? 'bg-white/60' : 'bg-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div
              className={`p-3 border-t ${
                theme === 'dark'
                  ? 'border-white/10 bg-gradient-to-br from-cyan-500/5 to-purple-500/5'
                  : 'border-slate-200/30 bg-gradient-to-br from-white/80 to-cyan-100/70'
              }`}
            >
              <div className="flex items-stretch space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Ask anything..."
                    maxLength={MAX_CHARS}
                    className={`w-full px-3 py-2 pr-12 rounded-xl border focus:outline-none focus:ring-2 transition-colors text-sm resize-none font-medium ${
                      theme === 'dark'
                        ? 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-cyan-400/50 focus:border-cyan-400/50'
                        : 'bg-white/40 border-slate-200/50 text-slate-700 placeholder-slate-500 focus:ring-cyan-400/50 focus:border-cyan-400/50'
                    }`}
                    disabled={isLoading}
                    style={{ overflowWrap: 'break-word' }}
                  />
                  {/* Character Counter — only shown when typing */}
                  {message.length > 0 && (
                    <div className="absolute bottom-2 right-2 pointer-events-none">
                      <div
                        className={`px-1 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                          message.length > MAX_CHARS
                            ? 'text-red-400 border-red-400/40 bg-red-500/20'
                            : theme === 'dark'
                              ? 'text-cyan-300/70 border-cyan-400/20 bg-cyan-500/10'
                              : 'text-slate-500 border-slate-300/40 bg-white/50'
                        }`}
                      >
                        {message.length}/{MAX_CHARS}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={sendMessage}
                  disabled={
                    isLoading || !message.trim() || message.length > MAX_CHARS
                  }
                  className={`px-3 py-2 rounded-xl border transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex-shrink-0 ${
                    theme === 'dark'
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30'
                      : 'bg-cyan-400/30 border-cyan-500/50 text-cyan-700 hover:bg-cyan-400/40'
                  }`}
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
