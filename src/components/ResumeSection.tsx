'use client'

import { useState } from 'react'

export default function ResumeSection() {
  const [showAllSkills, setShowAllSkills] = useState(false)

  const skills = [
    'TypeScript',
    'JavaScript',
    'Python',
    'PHP',
    'React',
    'Next.js',
    'Tailwind CSS',
    'Accessibility (WCAG)',
    'Responsive Design',
    'API Design',
    'REST',
    'Docker',
    'Github Actions',
    'Cloud Deployment',
    'GenAI Prototyping',
    'Prompt Engineering',
    'Design Patterns',
    'DSA',
    'System Design',
  ]

  // Show 8 on mobile, 20 on desktop, all when expanded
  const mobileVisibleSkills = showAllSkills ? skills : skills.slice(0, 8)
  const desktopVisibleSkills = showAllSkills ? skills : skills.slice(0, 20)

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden">
      <div className="px-8 py-12 md:p-12">
        <div className="text-center mb-12">
          {/* Mobile layout - stacked */}
          <div className="flex flex-col items-center gap-4 md:hidden">
            <h2 className="text-3xl font-bold text-[var(--foreground)]">
              Resume
            </h2>
            <a
              href="/Nicole-Wert_Resume.pdf"
              download
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 shadow-lg"
              aria-label="Download Resume PDF"
            >
              <span className="text-[var(--foreground)] font-medium">
                Download
              </span>
              <svg
                className="w-5 h-5 text-[var(--foreground)] group-hover:animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </a>
          </div>

          {/* Desktop layout - side by side */}
          <div className="hidden md:flex items-center justify-center gap-4">
            <h2 className="text-4xl font-bold text-[var(--foreground)]">
              Resume
            </h2>
            <a
              href="/Nicole-Wert_Resume.pdf"
              download
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 shadow-lg"
              aria-label="Download Resume PDF"
            >
              <span className="text-[var(--foreground)] font-medium">
                Download
              </span>
              <svg
                className="w-5 h-5 text-[var(--foreground)] group-hover:animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
          <div className="space-y-10 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">
                Experience
              </h3>
              <div className="space-y-4 text-base text-[var(--foreground)]/80">
                <div className="space-y-1">
                  <div className="font-medium">Software Engineer</div>
                  <div className="text-sm">Malwarebytes (2022–Present)</div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">
                Education
              </h3>
              <div className="space-y-2 text-[var(--foreground)]/80">
                <div className="font-medium">
                  B.S. in Energy & Environmental Science and Engineering
                </div>
                <div className="font-medium">
                  B.S. in Creative Technology Management
                </div>
                <div className="text-sm">Yonsei University</div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[var(--foreground)]">
              Skills
            </h3>
            <div className="space-y-4">
              {/* Mobile skills display */}
              <div className="flex flex-wrap gap-2 text-[var(--foreground)]/80 md:hidden">
                {mobileVisibleSkills.map((skill) => (
                  <div
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-[var(--accent)]/10 hover:text-[var(--primary)] hover:bg-[var(--primary)]/20 hover:scale-110 text-center font-medium whitespace-nowrap shadow-sm transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    {skill}
                  </div>
                ))}
              </div>

              {/* Desktop skills display */}
              <div className="hidden md:flex flex-wrap gap-2 text-[var(--foreground)]/80">
                {desktopVisibleSkills.map((skill) => (
                  <div
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-[var(--accent)]/10 hover:text-[var(--primary)] hover:bg-[var(--primary)]/20 hover:scale-110 text-center font-medium whitespace-nowrap shadow-sm transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    {skill}
                  </div>
                ))}
              </div>

              {/* Toggle button - show on mobile when >8 skills, on desktop when >20 skills */}
              <div className="block md:hidden">
                {skills.length > 8 && (
                  <button
                    onClick={() => setShowAllSkills(!showAllSkills)}
                    className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors duration-200 text-sm font-medium"
                  >
                    {showAllSkills ? (
                      <>
                        Show less
                        <svg
                          className="w-4 h-4 transform rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        Show more ({skills.length - 8} more)
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="hidden md:block">
                {skills.length > 20 && (
                  <button
                    onClick={() => setShowAllSkills(!showAllSkills)}
                    className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors duration-200 text-sm font-medium"
                  >
                    {showAllSkills ? (
                      <>
                        Show less
                        <svg
                          className="w-4 h-4 transform rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        Show more ({skills.length - 20} more)
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
