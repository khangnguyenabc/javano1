import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { useTheme } from '../../context/ThemeContext'

/**
 * Syntax-highlighted code block.
 * @param {{ code: string, language?: string, showLineNumbers?: boolean }} props
 */
export default function CodeBlock({ code, language = 'java', showLineNumbers = false }) {
  const { isDark } = useTheme()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="my-5 border border-border rounded-sm overflow-hidden text-[13px]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
        <span className="font-mono text-[10px] text-faint uppercase tracking-widest select-none">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="font-mono text-[10px] text-faint hover:text-primary transition-colors duration-150 min-h-[28px] px-1"
          aria-label="Copy code to clipboard"
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>

      {/* Code with syntax highlighting */}
      <Highlight
        theme={isDark ? themes.vsDark : themes.github}
        code={code.trim()}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto p-4 leading-relaxed m-0`}
            style={{
              ...style,
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              // Override prism background to use our token so dark mode works
              background: isDark ? 'rgb(22 27 34)' : 'rgb(250 250 248)',
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell pr-4 text-right select-none opacity-40 min-w-[2rem]">
                    {i + 1}
                  </span>
                )}
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
