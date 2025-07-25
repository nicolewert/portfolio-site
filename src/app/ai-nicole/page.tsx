'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function AINicole() {
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden relative">
      {/* Futuristic background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.1),_transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.05),_transparent_50%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      {/* Navigation */}
      <div className="fixed top-6 right-6 z-50">
        <a
          href="/portfolio"
          className="glass-button px-6 py-3 rounded-xl text-white/90 hover:text-white backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium"
        >
          View Portfolio →
        </a>
      </div>

      <div className="flex h-screen">
        {/* Left side - Holographic Profile */}
        <div className="w-1/3 flex flex-col items-center justify-center p-8">
          <div className="holographic-frame relative">
            {/* Glass frame with glow effect */}
            <div className="relative w-64 h-64 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/30 shadow-2xl">
              {/* Inner glow */}
              <div className="absolute inset-1 rounded-3xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse" />

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

              {/* Corner accents */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 rounded-br-lg" />
            </div>

            {/* Status indicator */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="glass-tag px-4 py-2 rounded-full backdrop-blur-md bg-green-500/20 border border-green-400/40 text-green-300 text-sm font-medium">
                ● Nicole AI Online
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mt-12 mb-4 text-center">
            Chat with Nicole AI
          </h1>
          <p className="text-blue-200/80 text-center max-w-sm">
            Ask me anything about Nicole&apos;s skills, projects, or experience
          </p>
        </div>

        {/* Right side - Chat Interface */}
        <div className="flex-1 flex flex-col p-8">
          {/* Chat container */}
          <div className="glass-chat flex-1 backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
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
                        ? 'bg-blue-500/20 border-blue-400/40 text-blue-100'
                        : 'bg-white/10 border-white/20 text-white/90'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass-message bg-white/10 border-white/20 px-4 py-3 rounded-2xl backdrop-blur-md border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="p-6 border-t border-white/10">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me about Nicole..."
                  className="flex-1 glass-input px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !message.trim()}
                  className="glass-button px-6 py-3 rounded-xl backdrop-blur-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
