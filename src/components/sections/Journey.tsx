import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Briefcase } from 'lucide-react'
import aboutMeData from '@/data/about-me.json'

export const Journey = () => {
  // Assuming the structure of about-me.json, map it to a simpler format
  // Ideally, you'd check the JSON structure first, but for this step we'll iterate safely.
  const experiences = aboutMeData.experience || []

  return (
    <section
      id="journey"
      className="w-full max-w-4xl mx-auto px-4 py-24 relative z-10 scroll-mt-20"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-12 text-center">
        My Journey
      </h2>

      <div className="space-y-8 relative">
        {/* Vertical Line */}
        <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent hidden md:block"></div>

        {/* Experience Items */}
        {experiences.map(
          (
            exp: {
              role: string
              company: string
              duration: string
              description: string
              skills?: string[]
            },
            index: number
          ) => (
            <div
              key={index}
              className="relative flex flex-col md:flex-row gap-6 md:pl-12 group"
            >
              {/* Dot on Timeline */}
              <div className="absolute left-[13px] top-6 w-3.5 h-3.5 rounded-full bg-white dark:bg-zinc-900 border-2 border-blue-500 z-10 hidden md:block group-hover:bg-blue-500 transition-colors"></div>

              <GlassCard variant="hover" className="flex-1 p-6 md:p-8">
                <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                        {exp.role}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-200">
                        {exp.company}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-black/20 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">
                    {exp.duration}
                  </span>
                </div>

                <p className="text-slate-700 dark:text-zinc-300 leading-relaxed mb-4">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {exp.skills?.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs text-slate-600 dark:text-zinc-400 px-2 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </div>
          )
        )}
      </div>
    </section>
  )
}
