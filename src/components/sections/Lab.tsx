import { FlaskConical } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { LabItemCard } from '@/components/LabItemCard'
import { getPublishedLabItems } from '@/lib/lab'

export async function Lab() {
  const items = await getPublishedLabItems()

  return (
    <section
      id="lab"
      className="w-full max-w-5xl mx-auto px-4 py-24 relative z-10 scroll-mt-20"
    >
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <FlaskConical
            className="text-blue-600 dark:text-blue-400"
            size={32}
          />
          The Lab
        </h2>
        <p className="text-slate-600 dark:text-zinc-400 hidden md:block">
          UI Prototypes & Experiments
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <LabItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <GlassCard className="flex flex-col items-center justify-center p-12 text-center border-dashed border-slate-300 dark:border-white/5">
          <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-200 dark:bg-zinc-800/50 dark:border-zinc-700 flex items-center justify-center mb-4">
            <span className="text-2xl">🧪</span>
          </div>
          <h3 className="text-slate-800 dark:text-zinc-300 font-semibold mb-2">
            Experiments brewing...
          </h3>
          <p className="text-slate-600 dark:text-zinc-500 text-sm">
            Check back soon for UI prototypes and creative experiments.
          </p>
        </GlassCard>
      )}
    </section>
  )
}
