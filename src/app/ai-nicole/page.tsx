'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTheme } from '../../contexts/ThemeContext'
import DarkModeToggle from '../../components/DarkModeToggle'

const FormattedMessage = ({
  content,
  theme,
}: {
  content: string
  theme: string
}) => {
  const formatText = (text: string) => {
    // Split by double line breaks to create paragraphs
    const paragraphs = text.split(/\n\s*\n/)

    return paragraphs.map((paragraph, pIndex) => {
      // Check if it's a bullet point list
      if (
        paragraph.includes('•') ||
        paragraph.includes('-') ||
        /^\d+\./.test(paragraph)
      ) {
        const lines = paragraph.split('\n').filter((line) => line.trim())
        return (
          <div key={pIndex} className="mb-3">
            {lines.map((line, lIndex) => {
              const trimmed = line.trim()
              if (
                trimmed.startsWith('•') ||
                trimmed.startsWith('-') ||
                /^\d+\./.test(trimmed)
              ) {
                return (
                  <div key={lIndex} className="flex items-start gap-2 mb-1">
                    <span
                      className={`text-xs mt-1 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}
                    >
                      {trimmed.startsWith('•')
                        ? '•'
                        : trimmed.startsWith('-')
                          ? '•'
                          : '•'}
                    </span>
                    <span className="flex-1">
                      {trimmed.replace(/^[•\-]|\d+\.\s*/, '').trim()}
                    </span>
                  </div>
                )
              }
              return (
                <div key={lIndex} className="mb-1">
                  {trimmed}
                </div>
              )
            })}
          </div>
        )
      }

      // Regular paragraph - split long ones
      const sentences = paragraph.split(/(?<=[.!?])\s+/)
      if (sentences.length > 2) {
        // Break into smaller chunks
        const chunks = []
        for (let i = 0; i < sentences.length; i += 2) {
          chunks.push(sentences.slice(i, i + 2).join(' '))
        }
        return (
          <div key={pIndex} className="mb-3">
            {chunks.map((chunk, cIndex) => (
              <div key={cIndex} className="mb-2">
                {chunk}
              </div>
            ))}
          </div>
        )
      }

      return (
        <div key={pIndex} className="mb-3">
          {paragraph}
        </div>
      )
    })
  }

  return <div>{formatText(content)}</div>
}

export default function AINicole() {
  const { theme } = useTheme()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm Nicole's AI assistant. Ask me anything about her skills, projects, or experience!",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Keyboard height detection for mobile
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    const handleViewportChange = () => {
      checkIsDesktop()
      if (window.visualViewport && window.innerWidth < 1024) {
        const keyboardHeight = window.innerHeight - window.visualViewport.height
        setKeyboardHeight(Math.max(0, keyboardHeight))
      }
    }

    checkIsDesktop()

    // VirtualKeyboard API enhancement (modern browsers)
    if ('virtualKeyboard' in navigator) {
      try {
        const nav = navigator as Navigator & {
          virtualKeyboard?: { overlaysContent: boolean }
        }
        if (nav.virtualKeyboard) {
          nav.virtualKeyboard.overlaysContent = true
        }
      } catch (e) {
        // Ignore if not supported
      }
    }

    window.addEventListener('resize', checkIsDesktop)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange)
      return () => {
        window.removeEventListener('resize', checkIsDesktop)
        window.visualViewport?.removeEventListener(
          'resize',
          handleViewportChange
        )
      }
    }

    return () => {
      window.removeEventListener('resize', checkIsDesktop)
    }
  }, [])

  const sendMessage = async () => {
    if (!message.trim()) return

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
    } catch (error) {
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

  // Theme-aware gradient backgrounds using your portfolio theme colors
  const backgroundClass =
    theme === 'dark'
      ? 'h-screen supports-[height:100dvh]:h-dvh w-screen overflow-hidden relative'
      : 'h-screen supports-[height:100dvh]:h-dvh w-screen overflow-hidden relative'

  return (
    <main
      className={backgroundClass}
      style={{
        background:
          theme === 'dark'
            ? 'linear-gradient(135deg, #0a0e1a 0%, #151b2e 25%, #1a1f2e 50%, #0f1419 75%, #0a0e1a 100%)'
            : 'linear-gradient(135deg, #f0f4ff 0%, #fafbff 25%, #e8f0ff 50%, #f0f8ff 75%, #f0f4ff 100%)',
      }}
    >
      {/* Prismatic background effects */}
      <div
        className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-[radial-gradient(circle_at_20%_80%,_rgba(0,255,255,0.15),_transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(139,92,246,0.1),_transparent_50%),radial-gradient(circle_at_50%_0%,_rgba(255,0,128,0.08),_transparent_70%)]'
            : 'bg-[radial-gradient(circle_at_20%_80%,_rgba(0,212,255,0.25),_transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(199,125,255,0.3),_transparent_50%),radial-gradient(circle_at_50%_0%,_rgba(255,107,157,0.2),_transparent_70%)]'
        }`}
      />
      {/* Animated prismatic grid */}
      <div
        className={`absolute inset-0 bg-[size:60px_60px] ${
          theme === 'dark'
            ? 'bg-[radial-gradient(circle,rgba(0,255,255,0.03)_1px,transparent_1px)]'
            : 'bg-[radial-gradient(circle,rgba(0,212,255,0.08)_1px,transparent_1px)]'
        }`}
      />

      {/* Navigation Panel - Desktop */}
      <div className="fixed bottom-4 left-4 lg:bottom-6 lg:left-6 z-50 hidden lg:block">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md border shadow-lg transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-400/30'
              : 'bg-gradient-to-r from-white/70 to-cyan-50/60 border-cyan-400/40'
          }`}
        >
          <DarkModeToggle />
          <div
            className={`w-px h-6 ${theme === 'dark' ? 'bg-cyan-400/30' : 'bg-cyan-400/40'}`}
          />
          <a
            href="/portfolio"
            className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'text-cyan-300 hover:text-cyan-200'
                : 'text-cyan-800 hover:text-cyan-900'
            }`}
          >
            View Portfolio →
          </a>
        </div>
      </div>

      {/* Theme Toggle - Mobile (Top Right) */}
      <div className="fixed top-4 right-4 z-50 lg:hidden landscape:max-lg:hidden">
        <div
          className={`p-0.5 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-400/30'
              : 'bg-gradient-to-r from-white/70 to-cyan-50/60 border-cyan-400/40'
          }`}
        >
          <DarkModeToggle />
        </div>
      </div>

      {/* Glass Prism Header Bar - Mobile Landscape Only */}
      <div className="hidden landscape:max-lg:flex fixed top-0 left-0 right-0 z-40 h-16">
        <div
          className={`w-full backdrop-blur-xl border-b shadow-lg ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-cyan-500/10 border-cyan-400/30'
              : 'bg-gradient-to-r from-white/80 via-cyan-50/60 to-white/80 border-cyan-400/50'
          }`}
        >
          <div className="flex items-center justify-between h-full px-4">
            {/* Compact Profile Section */}
            <div className="flex items-center gap-3">
              {/* Mini Profile Picture with Glass Frame */}
              <div className="relative">
                <div
                  className={`relative w-10 h-10 rounded-2xl backdrop-blur-md shadow-lg ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-cyan-400/20 to-purple-500/10 border border-cyan-400/40'
                      : 'bg-gradient-to-br from-white/70 to-cyan-100/60 border border-cyan-400/60'
                  }`}
                >
                  {/* Mini Profile Picture */}
                  <div className="absolute inset-1 rounded-xl overflow-hidden">
                    <Image
                      src="/profile_picture.png"
                      alt="Nicole Wert"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover filter brightness-110 contrast-110"
                      priority
                    />
                    {/* Mini holographic overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                  </div>

                  {/* Mini prismatic corners */}
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

              {/* Compact Title */}
              <h1
                className={`text-base font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  theme === 'dark'
                    ? 'from-cyan-300 via-white to-purple-300'
                    : 'from-cyan-600 via-slate-800 to-purple-600'
                }`}
              >
                Chat with Nicole AI
              </h1>
            </div>

            {/* Right Side - Status & Theme */}
            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-md border text-xs font-medium ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-green-400/20 border-cyan-400/40 text-cyan-300'
                    : 'bg-gradient-to-r from-white/80 to-cyan-50/60 border-cyan-500/60 text-cyan-900'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'}`}
                />
                <span>Online</span>
              </div>

              {/* Theme Toggle */}
              <div
                className={`p-1 rounded-full backdrop-blur-md border ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-400/30'
                    : 'bg-gradient-to-r from-white/70 to-cyan-50/60 border-cyan-400/40'
                }`}
              >
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col landscape:max-lg:flex-row lg:flex-row h-full supports-[height:100dvh]:h-dvh w-full">
        {/* Left side - Holographic Profile - Hidden in Mobile Landscape */}
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-2 landscape:max-lg:p-1 sm:p-4 lg:p-8 min-h-[25vh] supports-[height:100dvh]:min-h-[25dvh] landscape:max-lg:min-h-0 lg:min-h-0 flex-shrink-0 landscape:max-lg:hidden">
          <div className="holographic-frame relative">
            {/* Glass frame with prismatic glow effect */}
            <div
              className={`relative w-24 h-24 max-lg:landscape:w-16 max-lg:landscape:h-16 xs:w-32 xs:h-32 sm:w-56 sm:h-56 lg:w-64 lg:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 rounded-3xl backdrop-blur-xl shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-cyan-400/10 to-purple-500/5 border border-cyan-400/30'
                  : 'bg-gradient-to-br from-white/70 to-cyan-100/80 border border-cyan-400/60'
              }`}
            >
              {/* Prismatic inner glow */}
              <div
                className={`absolute inset-1 rounded-3xl animate-pulse ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-cyan-400/20 via-purple-500/15 to-pink-500/10'
                    : 'bg-gradient-to-br from-cyan-400/35 via-purple-400/30 to-pink-400/25'
                }`}
              />

              {/* Profile picture */}
              <div className="absolute inset-4 rounded-2xl overflow-hidden">
                <Image
                  src="/profile_picture.png"
                  alt="Nicole Wert"
                  width={256}
                  height={256}
                  className="w-full h-full object-cover filter brightness-110 contrast-110"
                  priority
                />
                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>

              {/* Prismatic corner accents */}
              <div
                className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg ${
                  theme === 'dark' ? 'border-cyan-400/80' : 'border-cyan-600/90'
                }`}
              />
              <div
                className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg ${
                  theme === 'dark'
                    ? 'border-purple-400/80'
                    : 'border-purple-600/90'
                }`}
              />
              <div
                className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg ${
                  theme === 'dark' ? 'border-pink-400/80' : 'border-pink-600/90'
                }`}
              />
              <div
                className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg ${
                  theme === 'dark' ? 'border-cyan-400/80' : 'border-cyan-600/90'
                }`}
              />
            </div>

            {/* Prismatic status indicator */}
            <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 transform -translate-x-1/2 hidden sm:block max-lg:landscape:hidden lg:block">
              <div
                className={`glass-tag px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full backdrop-blur-md border text-xs sm:text-sm font-medium ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-green-400/20 border-cyan-400/40 text-cyan-300'
                    : 'bg-gradient-to-r from-white/80 to-cyan-50/60 border-cyan-500/60 text-cyan-900 shadow-lg'
                }`}
              >
                ● Nicole AI Online
              </div>
            </div>
          </div>

          <h1
            className={`text-lg max-lg:landscape:text-base sm:text-3xl lg:text-4xl font-bold mt-2 max-lg:landscape:mt-1 sm:mt-6 lg:mt-12 mb-1 max-lg:landscape:mb-0 sm:mb-2 lg:mb-4 text-center bg-gradient-to-r bg-clip-text text-transparent ${
              theme === 'dark'
                ? 'from-cyan-300 via-white to-purple-300'
                : 'from-cyan-600 via-slate-800 to-purple-600'
            }`}
          >
            Chat with Nicole AI
          </h1>
          <p
            className={`text-center max-w-sm text-sm lg:text-base hidden sm:block max-lg:landscape:hidden lg:block ${
              theme === 'dark' ? 'text-cyan-200/80' : 'text-slate-600'
            }`}
          >
            Ask me anything about Nicole&apos;s skills, projects, or experience
          </p>

          {/* Portfolio Link - Mobile */}
          <div className="flex justify-center mt-2 max-lg:landscape:mt-1 sm:mt-4 lg:hidden">
            <a
              href="/portfolio"
              className={`flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-400/30 text-cyan-300 hover:text-cyan-200'
                  : 'bg-gradient-to-r from-white/70 to-cyan-50/60 border-cyan-400/40 text-cyan-800 hover:text-cyan-900'
              }`}
            >
              <span className="text-xs font-medium">Portfolio</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 7H17V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Right side - Chat Interface */}
        <div className="flex-1 flex flex-col p-2 landscape:max-lg:p-1 sm:p-4 lg:p-8 min-w-0 min-h-0 portrait:max-lg:min-h-[50vh] supports-[height:100dvh]:portrait:max-lg:min-h-[50dvh] landscape:max-lg:w-full landscape:max-lg:pt-20">
          {/* Prismatic chat container */}
          <div
            className={`glass-chat backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col flex-1 relative ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-400/20'
                : 'bg-gradient-to-br from-white/60 to-cyan-100/70 border border-cyan-400/50'
            }`}
          >
            {/* Chat messages */}
            <div
              className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto overflow-x-hidden"
              style={{
                paddingBottom: isDesktop
                  ? '0px'
                  : keyboardHeight > 0
                    ? `${keyboardHeight + 80}px`
                    : '80px',
              }}
            >
              <div className="flex flex-col space-y-3 sm:space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`glass-message ${
                        msg.role === 'user'
                          ? 'max-w-[280px] sm:max-w-xs lg:max-w-md'
                          : 'max-w-[280px] sm:max-w-xs lg:max-w-md'
                      } px-3 lg:px-4 py-2 lg:py-3 rounded-2xl backdrop-blur-md border text-sm lg:text-base break-words word-wrap overflow-wrap-anywhere ${
                        msg.role === 'user'
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/40 text-cyan-100'
                            : 'bg-gradient-to-r from-cyan-400/30 to-blue-400/30 border-cyan-500/50 text-cyan-800'
                          : theme === 'dark'
                            ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/20 text-purple-100'
                            : 'bg-gradient-to-r from-white/60 to-purple-50/50 border-purple-300/40 text-slate-700'
                      }`}
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
                      className={`glass-message px-4 py-3 rounded-2xl backdrop-blur-md border ${
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

                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Fixed Input area */}
            <div
              className={`fixed bottom-0 left-0 right-0 landscape:max-lg:relative landscape:max-lg:bottom-auto lg:relative lg:bottom-auto p-3 sm:p-4 lg:p-6 border-t backdrop-blur-xl z-50 ${
                theme === 'dark'
                  ? 'border-white/10 bg-gradient-to-br from-cyan-500/5 to-purple-500/5'
                  : 'border-slate-200/30 bg-gradient-to-br from-white/80 to-cyan-100/70'
              }`}
            >
              <div className="flex space-x-1 sm:space-x-2 lg:space-x-4 max-w-full">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && !e.shiftKey && sendMessage()
                  }
                  placeholder="Ask me about Nicole..."
                  inputMode="text"
                  className={`flex-1 glass-input px-2 sm:px-3 lg:px-4 py-2 lg:py-3 rounded-lg sm:rounded-xl backdrop-blur-md border focus:outline-none focus:ring-2 transition-all duration-300 text-sm lg:text-base min-w-0 ${
                    theme === 'dark'
                      ? 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-cyan-400/50 focus:border-cyan-400/50'
                      : 'bg-white/40 border-slate-200/50 text-slate-700 placeholder-slate-500 focus:ring-blue-400/50 focus:border-blue-400/50'
                  }`}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !message.trim()}
                  className={`glass-button px-2 sm:px-4 lg:px-6 py-2 lg:py-3 rounded-lg sm:rounded-xl backdrop-blur-md border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm lg:text-base flex-shrink-0 ${
                    theme === 'dark'
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30'
                      : 'bg-blue-400/30 border-blue-500/50 text-blue-700 hover:bg-blue-400/40'
                  }`}
                >
                  Send
                </button>
              </div>
              {/* Safe area padding for mobile */}
              <div className="h-safe-area-inset-bottom lg:hidden" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(300%) translateY(300%) rotate(45deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        .bg-grid-white\/\[0\.02\] {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.02) 1px,
            transparent 1px
          );
        }
      `}</style>
    </main>
  )
}
