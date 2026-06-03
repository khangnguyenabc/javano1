import { useState, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Supports two modes:
 *  - Uncontrolled (default): internal state, navigates to /search on submit
 *  - Controlled: pass `value` + `onValueChange`; still navigates on submit
 */
const SearchBar = forwardRef(function SearchBar(
  { className = '', defaultValue = '', value: controlledValue, onValueChange },
  ref
) {
  const [internalQuery, setInternalQuery] = useState(defaultValue)
  const navigate = useNavigate()

  const isControlled = controlledValue !== undefined
  const query = isControlled ? controlledValue : internalQuery

  function handleChange(e) {
    const v = e.target.value
    if (isControlled) onValueChange?.(v)
    else setInternalQuery(v)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const q = query.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`} role="search">
      {/* Magnifier */}
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx={11} cy={11} r={7} />
        <line x1={21} y1={21} x2={16.65} y2={16.65} />
      </svg>

      <input
        ref={ref}
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search topics, patterns, interview questions…"
        aria-label="Search the knowledge base"
        className="
          w-full bg-bg border border-border rounded-sm
          py-3 pl-10 pr-4 md:pr-20
          font-serif text-base text-primary
          placeholder:text-faint placeholder:italic
          focus:outline-none focus:border-muted
          transition-colors duration-150
        "
      />

      {/* ⌘K badge — desktop only */}
      <span
        className="
          hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2
          items-center text-xs font-mono text-faint
          border border-border rounded px-1.5 py-0.5
          select-none pointer-events-none
        "
        aria-hidden="true"
      >
        ⌘K
      </span>
    </form>
  )
})

export default SearchBar
