import { useState, useEffect } from 'react'

/** @param {{ sections: Array<{id: string, title: string, badge: string}> }} props */
export function RedisTOC({ sections }) {
  const [activeId, setActiveId] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { threshold: 0.3 }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  function handleClick(e, id) {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileOpen(false)
  }

  return (
    <>
      {/* ── Desktop sidebar (md+) ──────────────────────────────── */}
      <nav
        className="hidden md:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto"
        aria-label="Table of contents"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-faint mb-4 select-none">
          Contents
        </p>
        <ul className="space-y-0.5">
          {sections.map(({ id, title }) => {
            const isActive = activeId === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => handleClick(e, id)}
                  className={[
                    'block py-2 px-3 rounded-sm font-sans text-sm transition-colors duration-150',
                    isActive
                      ? 'text-accent border-l-2 border-accent bg-surface font-medium'
                      : 'text-muted hover:text-primary hover:bg-surface',
                  ].join(' ')}
                >
                  {title}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ── Mobile accordion (< md) ───────────────────────────── */}
      <nav className="md:hidden" aria-label="Table of contents">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          className="w-full flex items-center justify-between border border-border rounded-sm bg-surface hover:bg-border/50 font-sans text-sm text-muted px-4 min-h-[48px] transition-colors duration-150"
        >
          <span>Contents ({sections.length} sections)</span>
          <span
            className={`select-none transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>

        {/*
          Grid-rows trick: animates from grid-rows-[0fr] → grid-rows-[1fr]
          so max-height expands to the real content height, not an arbitrary cap.
          The inner div needs min-h-0 to allow the grid row to collapse to 0.
        */}
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${
            mobileOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border border-t-0 border-border rounded-b-sm max-h-72 overflow-y-auto">
              <div className="grid grid-cols-2 p-2">
                {sections.map(({ id, title }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => handleClick(e, id)}
                    className="font-sans text-sm text-muted min-h-[40px] flex items-center py-1 px-2 hover:text-accent transition-colors duration-150 leading-snug"
                  >
                    {title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
