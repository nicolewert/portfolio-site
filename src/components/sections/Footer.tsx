import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Github, Linkedin, Mail } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="w-full relative z-10 pb-32 pt-12 px-4">
      <GlassCard className="max-w-2xl mx-auto p-8 md:p-12 text-center bg-black/40 border-white/5">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Let&apos;s Create Together
        </h2>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">
          Always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision.
        </p>

        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/nicolewert"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-zinc-400 transition-all border border-transparent hover:border-white/10"
          >
            <Github size={24} />
          </a>
          <a
            href="https://linkedin.com/in/nicolewert"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-zinc-400 transition-all border border-transparent hover:border-white/10"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="mailto:nicole.wert@example.com"
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-zinc-400 transition-all border border-transparent hover:border-white/10"
          >
            <Mail size={24} />
          </a>
        </div>

        <div className="mt-12 text-xs text-zinc-600 font-mono">
          © {new Date().getFullYear()} Nicole Wert. Built with Next.js,
          Tailwind & magic.
        </div>
      </GlassCard>
    </footer>
  )
}
