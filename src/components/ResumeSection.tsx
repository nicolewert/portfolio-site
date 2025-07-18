export default function ResumeSection() {
  return (
    <div className="glass w-full max-w-4xl mx-auto rounded-2xl overflow-hidden">
      <div className="px-8 py-12 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[var(--foreground)]">
            Resume
          </h2>
          <a
            href="/Nicole-Wert_Resume.pdf"
            download
            className="icy-button inline-block px-8 py-4 rounded-xl font-medium text-[var(--foreground)] shadow-lg hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
          >
            Download Resume (PDF)
          </a>
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
