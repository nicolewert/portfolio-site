import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Clock, Code, BookOpen } from 'lucide-react'

export const Now = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12 relative z-10">
      <div className="flex items-center gap-2 mb-6 text-slate-600 dark:text-zinc-400 text-sm uppercase tracking-wider font-medium">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Currently
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status 1: Coding Focus */}
        <GlassCard variant="hover" className="p-6 flex flex-col gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-500/20 w-fit rounded-lg">
            <Code size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-zinc-200 font-semibold mb-1">
              Deep Diving Next.js 14
            </h3>
            <p className="text-slate-600 dark:text-zinc-400 text-sm">
              Exploring server actions, streaming, and advanced routing
              patterns.
            </p>
          </div>
        </GlassCard>

        {/* Status 2: Learning */}
        <GlassCard variant="hover" className="p-6 flex flex-col gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-500/20 w-fit rounded-lg">
            <BookOpen
              size={20}
              className="text-purple-600 dark:text-purple-400"
            />
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-zinc-200 font-semibold mb-1">
              Reading &quot;Designing Data-Intensive Applications&quot;
            </h3>
            <p className="text-slate-600 dark:text-zinc-400 text-sm">
              Focusing on data consistency, throughput, and failure modes.
            </p>
          </div>
        </GlassCard>

        {/* Status 3: Personal/Fun */}
        <GlassCard variant="hover" className="p-6 flex flex-col gap-4">
          <div className="p-3 bg-pink-100 dark:bg-pink-500/20 w-fit rounded-lg">
            <Clock size={20} className="text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-zinc-200 font-semibold mb-1">
              Building on Google Cloud & Gemini
            </h3>
            <p className="text-slate-600 dark:text-zinc-400 text-sm">
              Designing agentic apps and RAG pipelines for data-rich UIs.
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
