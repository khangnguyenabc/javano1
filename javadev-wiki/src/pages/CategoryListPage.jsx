import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCategories } from '../hooks/useCategories'

const DETAIL_SLUGS = new Set(['caching-redis', 'networking', 'design-patterns'])

const FILTER_GROUPS = [
  { label: 'All', slugs: null },
  {
    label: 'Core',
    slugs: ['core-java', 'jvm-internals', 'concurrency', 'design-patterns'],
  },
  {
    label: 'Advanced',
    slugs: ['system-design', 'kafka-mq', 'spring-ecosystem', 'security'],
  },
  {
    label: 'Ops',
    slugs: ['devops', 'caching-redis', 'database-sql', 'api-design', 'testing'],
  },
]

/* ─── Category row ──────────────────────────────────────────── */

function CategoryRow({ category, staggerIndex }) {
  const { slug, module, icon, title, subtitle, tags, estimatedMinutes } = category
  const isReady = DETAIL_SLUGS.has(slug)

  const inner = (
    <>
      {/* Module numeral */}
      <span className="font-serif text-accent text-sm font-bold w-8 shrink-0 pt-1 leading-none select-none">
        {module}
      </span>

      {/* Center */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1.5 flex-wrap">
          <span className="shrink-0 text-base leading-snug mt-0.5" aria-hidden="true">
            {icon}
          </span>
          <h2 className="font-serif font-bold text-lg text-primary leading-snug">
            {title}
          </h2>
          {isReady && (
            <span className="font-sans text-[10px] font-semibold bg-accent/10 text-accent border border-accent/30 rounded px-1.5 py-0.5 leading-none shrink-0 mt-0.5 self-start">
              Complete
            </span>
          )}
        </div>

        <p className="font-serif italic text-sm text-muted mb-3 leading-relaxed">
          {subtitle}
        </p>

        {/* Tags — hidden on xs */}
        <div className="hidden sm:flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-sans text-[11px] text-muted border border-border rounded px-1.5 py-0.5 leading-none"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right: time + action */}
      <div className="flex flex-col items-end gap-2 shrink-0 pt-0.5">
        <span className="font-sans text-xs text-faint whitespace-nowrap">
          {estimatedMinutes} min
        </span>
        {isReady ? (
          <span className="font-sans text-xs text-accent whitespace-nowrap transition-colors duration-150">
            View content →
          </span>
        ) : (
          <span className="font-sans text-[10px] text-faint border border-border rounded px-1.5 py-0.5 leading-none whitespace-nowrap">
            Coming soon
          </span>
        )}
      </div>
    </>
  )

  const baseClass = `
    group flex items-start gap-4 py-5 sm:py-6 px-4
    border-b border-border border-l-[3px]
    transition-colors duration-150 animate-fade-up
  `

  if (isReady) {
    return (
      <Link
        to={`/topics/${slug}`}
        className={`${baseClass} border-l-accent/40 hover:border-l-accent hover:bg-surface`}
        style={{ animationDelay: `${staggerIndex * 40}ms` }}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div
      className={`${baseClass} border-l-transparent`}
      style={{ animationDelay: `${staggerIndex * 40}ms` }}
    >
      {inner}
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function CategoryListPage() {
  const categories = useCategories()
  const [active, setActive] = useState('All')

  const filtered = useMemo(() => {
    const group = FILTER_GROUPS.find((g) => g.label === active)
    const list = group?.slugs
      ? categories.filter((c) => group.slugs.includes(c.slug))
      : categories
    // Detail-ready categories always appear first
    return [...list].sort((a, b) => {
      const aR = DETAIL_SLUGS.has(a.slug) ? 0 : 1
      const bR = DETAIL_SLUGS.has(b.slug) ? 0 : 1
      return aR - bR
    })
  }, [categories, active])

  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16">
      <Helmet>
        <title>All Topics — JavaDev.wiki</title>
        <meta name="description" content="13 modules covering the full Java backend stack — Core Java through Kubernetes." />
      </Helmet>

      {/* Page header */}
      <div className="border-b border-border pb-8">
        <p className="font-mono text-xs text-faint uppercase tracking-[0.18em] mb-4">
          Browse
        </p>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary mb-3 leading-tight tracking-tight">
          All topics
        </h1>
        <p className="font-serif italic text-muted text-base sm:text-lg leading-relaxed">
          13 modules covering the full Java backend stack —{' '}
          <span className="text-accent not-italic font-medium">3 complete</span>,{' '}
          10 coming soon
        </p>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2 py-5 border-b border-border">
        <span className="font-sans text-xs text-faint mr-1 shrink-0">
          Filter:
        </span>
        {FILTER_GROUPS.map((g) => (
          <button
            key={g.label}
            onClick={() => setActive(g.label)}
            className={`
              font-sans text-sm px-3 py-1.5 border rounded-full
              transition-colors duration-150 min-h-[34px]
              ${
                active === g.label
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-border text-muted hover:border-muted hover:text-primary'
              }
            `}
          >
            {g.label}
          </button>
        ))}

        <span className="ml-auto font-sans text-xs text-faint shrink-0">
          {filtered.length}&thinsp;/&thinsp;{categories.length}
        </span>
      </div>

      {/* List — key includes active filter so rows re-stagger on filter change */}
      <div>
        {filtered.length === 0 ? (
          <p className="py-12 text-center font-serif italic text-muted">
            No topics in this group.
          </p>
        ) : (
          filtered.map((cat, i) => (
            <CategoryRow
              key={`${active}-${cat.id}`}
              category={cat}
              staggerIndex={i}
            />
          ))
        )}
      </div>
    </div>
  )
}
