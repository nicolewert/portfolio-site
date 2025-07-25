'use client'

export default function AINicole() {
  return (
    <main className="min-h-screen bg-[var(--background)] w-full">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-8">
          Chat with Nicole AI
        </h1>
        <p className="text-lg text-[var(--secondary)] mb-8 text-center max-w-2xl">
          Welcome! I&apos;m Nicole&apos;s AI assistant. Ask me anything about
          her skills, projects, or experience.
        </p>

        {/* Temporary navigation to portfolio */}
        <div className="fixed top-4 right-4">
          <a
            href="/portfolio"
            className="glass px-4 py-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--foreground)]/10 transition-colors"
          >
            View Portfolio →
          </a>
        </div>

        <div className="text-[var(--secondary)]/60 text-sm">
          Coming soon: Glass futuristic chatbot interface!
        </div>
      </div>
    </main>
  )
}
