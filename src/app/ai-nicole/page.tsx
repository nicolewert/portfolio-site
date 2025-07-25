'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTheme } from '../../contexts/ThemeContext'
import DarkModeToggle from '../../components/DarkModeToggle'

export default function AINicole() {
  const { theme } = useTheme()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I&apos;m Nicole&apos;s AI assistant. Ask me anything about her skills, projects, or experience!',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

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
      ? 'min-h-screen overflow-hidden relative'
      : 'min-h-screen overflow-hidden relative'

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

      {/* Navigation Panel */}
      <div className="fixed bottom-6 left-6 z-50">
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

      <div className="flex h-screen">
        {/* Left side - Holographic Profile */}
        <div className="w-1/3 flex flex-col items-center justify-center p-8">
          <div className="holographic-frame relative">
            {/* Glass frame with prismatic glow effect */}
            <div
              className={`relative w-64 h-64 rounded-3xl backdrop-blur-xl shadow-2xl ${
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
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div
                className={`glass-tag px-4 py-2 rounded-full backdrop-blur-md border text-sm font-medium ${
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
            className={`text-4xl font-bold mt-12 mb-4 text-center bg-gradient-to-r bg-clip-text text-transparent ${
              theme === 'dark'
                ? 'from-cyan-300 via-white to-purple-300'
                : 'from-cyan-600 via-slate-800 to-purple-600'
            }`}
          >
            Chat with Nicole AI
          </h1>
          <p
            className={`text-center max-w-sm ${
              theme === 'dark' ? 'text-cyan-200/80' : 'text-slate-600'
            }`}
          >
            Ask me anything about Nicole&apos;s skills, projects, or experience
          </p>
        </div>

        {/* Right side - Chat Interface */}
        <div className="flex-1 flex flex-col p-8">
          {/* Prismatic chat container */}
          <div
            className={`glass-chat flex-1 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-400/20'
                : 'bg-gradient-to-br from-white/60 to-cyan-100/70 border border-cyan-400/50'
            }`}
          >
            {/* Chat messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[calc(100vh-200px)]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`glass-message max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-md border ${
                      msg.role === 'user'
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/40 text-cyan-100'
                          : 'bg-gradient-to-r from-cyan-400/30 to-blue-400/30 border-cyan-500/50 text-cyan-800'
                        : theme === 'dark'
                          ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/20 text-purple-100'
                          : 'bg-gradient-to-r from-white/60 to-purple-50/50 border-purple-300/40 text-slate-700'
                    }`}
                  >
                    {msg.content}
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
            </div>

            {/* Input area */}
            <div
              className={`p-6 border-t ${
                theme === 'dark' ? 'border-white/10' : 'border-slate-200/30'
              }`}
            >
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me about Nicole..."
                  className={`flex-1 glass-input px-4 py-3 rounded-xl backdrop-blur-md border focus:outline-none focus:ring-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-cyan-400/50 focus:border-cyan-400/50'
                      : 'bg-white/40 border-slate-200/50 text-slate-700 placeholder-slate-500 focus:ring-blue-400/50 focus:border-blue-400/50'
                  }`}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !message.trim()}
                  className={`glass-button px-6 py-3 rounded-xl backdrop-blur-md border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
                    theme === 'dark'
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30'
                      : 'bg-blue-400/30 border-blue-500/50 text-blue-700 hover:bg-blue-400/40'
                  }`}
                >
                  Send
                </button>
              </div>
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
