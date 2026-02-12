import React from 'react'

export const Hero = () => {
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 w-full relative">
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        {/* Main Title - Better visibility for both themes */}
        <h1
          className="text-5xl md:text-7xl font-inter font-semibold tracking-tighter text-slate-800 dark:text-white"
          style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
        >
          <span className="font-light italic block md:inline">
            Hi, I&apos;m
          </span>{' '}
          Nicole.
        </h1>

        {/* Subtitle - High contrast for readability */}
        <p
          className="text-lg md:text-xl font-inter font-light text-slate-600 dark:text-zinc-300 max-w-xl mx-auto leading-relaxed"
          style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
        >
          Building{' '}
          <span className="text-blue-600 dark:text-blue-400 font-normal">
            digital experiences
          </span>{' '}
          that are <br className="hidden md:block" /> fun, professional, and
          unique.
        </p>

        {/* CTA Buttons - Enhanced contrast */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
          <a
            href="#lab"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-300 flex items-center gap-2 group"
            style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
          >
            Explore the Lab
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
          <a
            href="#journey"
            className="px-6 py-2.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-600/10 dark:hover:bg-blue-600/20 border border-blue-300 dark:border-blue-500/50 text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg"
            style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
          >
            See My Journey
          </a>
        </div>
      </div>
    </section>
  )
}
