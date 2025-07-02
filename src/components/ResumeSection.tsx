export default function ResumeSection() {
  return (
    <div className="glass w-full max-w-4xl mx-auto rounded-2xl overflow-hidden">
      <div className="px-8 py-12 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[var(--foreground)]">
            Resume
          </h2>
          <a
            href="/resume.pdf"
            download
            className="icy-button inline-block px-8 py-4 rounded-xl font-medium text-[var(--foreground)] shadow-lg hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
          >
            Download Resume (PDF)
          </a>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[var(--foreground)]">
              Experience
            </h3>
            <div className="space-y-4 text-base text-[var(--foreground)]/80">
              <div className="space-y-1">
                <div className="font-medium">Software Engineer</div>
                <div className="text-sm">Tech Company (2022–Present)</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[var(--foreground)]">
              Education
            </h3>
            <div className="space-y-2 text-[var(--foreground)]/80">
              <div className="font-medium">B.S. in Computer Science</div>
              <div className="text-sm">University Name</div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[var(--foreground)]">
              Skills
            </h3>
            <div className="space-y-3 text-[var(--foreground)]/80">
              <div className="p-2 rounded-lg bg-[var(--accent)]/10">React, Next.js, TypeScript</div>
              <div className="p-2 rounded-lg bg-[var(--accent)]/10">Tailwind CSS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
