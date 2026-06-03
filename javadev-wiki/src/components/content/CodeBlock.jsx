import { useState } from 'react'

/**
 * Renders a code block with dark background, language badge, and copy button.
 * Background is always #1a1a18 (warm dark) regardless of light/dark mode.
 * @param {{ lang: string, value: string }} props
 */
export function CodeBlock({ lang, value }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="relative mb-6 rounded-sm overflow-hidden border border-border min-w-0">
      {/* Header bar — min-h-[44px] for mobile touch targets */}
      <div className="flex items-center justify-between px-3 py-2 min-h-[44px] bg-surface border-b border-border">
        <span className="font-mono text-xs text-muted select-none">{lang}</span>
        <button
          onClick={handleCopy}
          className="font-sans text-xs text-faint hover:text-primary transition-colors duration-150 px-2 min-h-[44px] flex items-center"
          aria-label="Copy code to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code area — always dark, horizontal scroll, no text wrap */}
      <pre
        style={{
          margin: 0,
          backgroundColor: '#1a1a18',
          color: '#f5f1eb',
          overflowX: 'auto',
          whiteSpace: 'pre',
          wordBreak: 'normal',
          overflowWrap: 'normal',
          fontFamily: 'var(--font-mono)',
        }}
        className="text-xs sm:text-sm leading-relaxed p-4"
      >
        {value}
      </pre>
    </div>
  )
}
