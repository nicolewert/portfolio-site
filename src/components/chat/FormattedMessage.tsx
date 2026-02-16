'use client'

import Link from 'next/link'

export const FormattedMessage = ({
  content,
  theme,
}: {
  content: string
  theme: string
}) => {
  // Function to parse and render markdown links
  const parseLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }

      const linkText = match[1]
      const linkUrl = match[2]
      const isExternal =
        linkUrl.startsWith('http') || linkUrl.startsWith('mailto:')

      // Create the link element
      if (isExternal) {
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline transition-all duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'text-cyan-300 hover:text-cyan-200'
                : 'text-cyan-600 hover:text-cyan-700'
            }`}
          >
            {linkText}
          </a>
        )
      } else {
        parts.push(
          <Link
            key={match.index}
            href={linkUrl}
            className={`underline transition-all duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'text-cyan-300 hover:text-cyan-200'
                : 'text-cyan-600 hover:text-cyan-700'
            }`}
          >
            {linkText}
          </Link>
        )
      }

      lastIndex = match.index + match[0].length
    }

    // Add remaining text after the last link
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts.length > 0 ? parts : [text]
  }

  const formatText = (text: string) => {
    // Split by double line breaks to create paragraphs
    const paragraphs = text.split(/\n\s*\n/)

    return paragraphs.map((paragraph, pIndex) => {
      // Check if it's a bullet point list
      if (
        paragraph.includes('\u2022') ||
        paragraph.includes('-') ||
        /^\d+\./.test(paragraph)
      ) {
        const lines = paragraph.split('\n').filter((line) => line.trim())
        return (
          <div key={pIndex} className="mb-3">
            {lines.map((line, lIndex) => {
              const trimmed = line.trim()
              if (
                trimmed.startsWith('\u2022') ||
                trimmed.startsWith('-') ||
                /^\d+\./.test(trimmed)
              ) {
                return (
                  <div key={lIndex} className="flex items-start gap-2 mb-1">
                    <span
                      className={`text-xs mt-1 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}
                    >
                      {'\u2022'}
                    </span>
                    <span className="flex-1">
                      {parseLinks(
                        trimmed.replace(/^[\u2022\-]|\d+\.\s*/, '').trim()
                      )}
                    </span>
                  </div>
                )
              }
              return (
                <div key={lIndex} className="mb-1">
                  {parseLinks(trimmed)}
                </div>
              )
            })}
          </div>
        )
      }

      // Regular paragraph - split long ones
      const sentences = paragraph.split(/(?<=[.!?])\s+/)
      if (sentences.length > 2) {
        // Break into smaller chunks
        const chunks = []
        for (let i = 0; i < sentences.length; i += 2) {
          chunks.push(sentences.slice(i, i + 2).join(' '))
        }
        return (
          <div key={pIndex} className="mb-3">
            {chunks.map((chunk, cIndex) => (
              <div key={cIndex} className="mb-2">
                {parseLinks(chunk)}
              </div>
            ))}
          </div>
        )
      }

      return (
        <div key={pIndex} className="mb-3">
          {parseLinks(paragraph)}
        </div>
      )
    })
  }

  return <div>{formatText(content)}</div>
}
