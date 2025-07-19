export default function ResumeSection() {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden">
      <div className="px-8 py-12 md:p-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
              Resume
            </h2>
            <a
              href="/Nicole-Wert_Resume.pdf"
              download
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
              aria-label="Download Resume PDF"
            >
              <svg
                className="w-6 h-6 text-[var(--foreground)] group-hover:animate-bounce"
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
            <div className="flex flex-wrap gap-2 text-[var(--foreground)]/80">
              {[
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
              ].map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-center font-medium whitespace-nowrap shadow-sm"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
