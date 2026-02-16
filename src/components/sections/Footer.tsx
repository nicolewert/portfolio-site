import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Github, Linkedin, Mail } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="w-full relative z-10 pb-32 pt-12 px-4">
      <GlassCard className="max-w-2xl mx-auto p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
          Let&apos;s Create Together
        </h2>
        <p className="text-slate-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
          Always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision.
        </p>

        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/nicolewert"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-300 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white dark:border-transparent dark:hover:border-white/10 transition-all"
          >
            <Github size={24} />
          </a>
          <a
            href="https://linkedin.com/in/nicolewert"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-300 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white dark:border-transparent dark:hover:border-white/10 transition-all"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="mailto:nicole.wert@example.com"
            className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-300 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white dark:border-transparent dark:hover:border-white/10 transition-all"
          >
            <Mail size={24} />
          </a>
        </div>

        <div className="mt-12 text-xs text-slate-500 dark:text-zinc-600 font-mono">
          © {new Date().getFullYear()} Nicole Wert. Built with Next.js,
          Tailwind & magic.
        </div>
      </GlassCard>
    </footer>
  )
}
