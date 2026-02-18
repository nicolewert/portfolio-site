import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import type { LabItem } from '@/types/lab'

interface LabItemCardProps {
  item: LabItem
}

export function LabItemCard({ item }: LabItemCardProps) {
  const Wrapper = item.link ? 'a' : 'div'
  const linkProps = item.link
    ? { href: item.link, target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...linkProps}
      className="glass rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 transition-[border-color,transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-xl p-6 flex flex-col group cursor-pointer"
    >
      {/* Featured Image */}
      {item.featured_image_url ? (
        <div className="mb-4 rounded-xl overflow-hidden">
          <Image
            src={item.featured_image_url.trim()}
            alt={item.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="mb-4 rounded-xl overflow-hidden h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
          <span className="text-4xl">🧪</span>
        </div>
      )}

      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-bold text-[var(--foreground)] text-xl line-clamp-1">
          {item.title}
        </h3>
        {item.link && (
          <ExternalLink
            size={16}
            className="text-[var(--secondary)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>

      {/* Description */}
      <p className="text-[var(--secondary)] mb-4 line-clamp-3 flex-grow">
        {item.description}
      </p>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag.name}
              className="text-xs px-2 py-1 rounded-full text-[var(--foreground)] glass"
              style={{
                backgroundColor: `${tag.color}15`,
                borderColor: `${tag.color}30`,
              }}
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </Wrapper>
  )
}
