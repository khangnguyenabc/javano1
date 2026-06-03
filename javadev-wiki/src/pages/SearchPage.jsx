import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Fuse from 'fuse.js'
import { categories } from '../data/categories'
import SearchBar from '../components/ui/SearchBar'

/* ─── Fuse instance (module-level, created once) ─────────────── */

const fuse = new Fuse(categories, {
  keys: ['title', 'subtitle', 'tags', 'subTopics'],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
})

/* ─── Skeleton rows ─────────────────────────────────────────── */

function SkeletonRow() {
  return (
    <div className="flex items-start gap-4 py-5 sm:py-6 px-4 border-b border-border animate-pulse">
      <div className="w-6 h-3.5 bg-border rounded mt-1 shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-border rounded w-3/5" />
        <div className="h-3.5 bg-border rounded w-2/5" />
        <div className="flex gap-2">
          <div className="h-4 w-14 bg-border rounded" />
          <div className="h-4 w-12 bg-border rounded" />
          <div className="h-4 w-16 bg-border rounded" />
        </div>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-2 pt-0.5">
        <div className="h-3 w-10 bg-border rounded" />
        <div className="h-4 w-4 bg-border rounded" />
      </div>
    </div>
  )
}

function SkeletonRows() {
  return (
    <div>
      {[0, 1, 2].map((i) => <SkeletonRow key={i} />)}
    </div>
  )
}

/* ─── Result row ─────────────────────────────────────────────── */

/**
 * @param {{ item: object, matches: array, staggerIndex: number }} props
 */
function ResultRow({ item, matches, staggerIndex }) {
  const matchedTags = useMemo(
    () =>
      new Set(
        (matches ?? [])
          .filter((m) => m.key === 'tags')
          .map((m) => m.value)
      ),
    [matches]
  )

  return (
    <Link
      to={`/topics/${item.slug}`}
      className="
        group flex items-start gap-4 py-5 sm:py-6 px-4
        border-b border-border
        border-l-[3px] border-l-transparent hover:border-l-accent
        hover:bg-surface transition-colors duration-150
        animate-fade-up
      "
      style={{ animationDelay: `${staggerIndex * 50}ms` }}
    >
      <span className="font-serif text-accent text-sm font-bold w-8 shrink-0 pt-1 leading-none select-none">
        {item.module}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1.5">
          <span className="shrink-0 text-base mt-0.5" aria-hidden="true">{item.icon}</span>
          <h2 className="font-serif font-bold text-lg text-primary leading-snug">{item.title}</h2>
        </div>
        <p className="font-serif italic text-sm text-muted mb-3 leading-relaxed">{item.subtitle}</p>

        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className={`
                font-sans text-[11px] border rounded px-1.5 py-0.5 leading-none
                ${
                  matchedTags.has(tag)
                    ? 'border-accent/40 text-accent bg-accent/10'
                    : 'border-border text-muted'
                }
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0 pt-0.5">
        <span className="font-sans text-xs text-faint whitespace-nowrap">
          {item.estimatedMinutes} min
        </span>
        <span
          className="font-serif text-muted group-hover:text-accent transition-colors"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </Link>
  )
}

/* ─── Empty state ────────────────────────────────────────────── */

function EmptyState({ query }) {
  return (
    <div className="py-16 text-center">
      <p className="font-serif italic text-muted text-lg mb-3">
        No results for{' '}
        <span className="not-italic text-primary font-medium">'{query}'</span>
      </p>
      <p className="font-sans text-sm text-faint mb-8">
        Try different keywords, or browse all topics.
      </p>
      <Link
        to="/topics"
        className="font-sans text-sm text-info hover:underline underline-offset-4 transition-colors"
      >
        Browse all 13 modules →
      </Link>
    </div>
  )
}

/* ─── Default prompt (no query) ──────────────────────────────── */

function DefaultPrompt() {
  return (
    <div className="py-16 text-center">
      <p className="font-serif italic text-muted text-base mb-2">
        Start typing to search across all 13 modules.
      </p>
      <p className="font-sans text-sm text-faint">
        Covers topics, patterns, tags, and sub-topics.
      </p>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const inputRef = useRef(null)

  const [localQuery, setLocalQuery] = useState(urlQuery)
  const [showSkeleton, setShowSkeleton] = useState(!!urlQuery)

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Dismiss skeleton after initial render
  useEffect(() => {
    if (!showSkeleton) return
    const t = setTimeout(() => setShowSkeleton(false), 350)
    return () => clearTimeout(t)
  }, []) // intentional empty deps — once on mount

  // Sync URL → input when navigating here from another page
  useEffect(() => {
    setLocalQuery(urlQuery)
  }, [urlQuery])

  const results = useMemo(() => {
    const q = localQuery.trim()
    return q ? fuse.search(q) : []
  }, [localQuery])

  const hasQuery = localQuery.trim().length > 0
  const pageTitle = hasQuery
    ? `Search: "${localQuery.trim()}" — JavaDev.wiki`
    : 'Search — JavaDev.wiki'

  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Search across all 13 Java backend modules." />
      </Helmet>

      <div className="mb-8">
        <p className="font-mono text-xs text-faint uppercase tracking-[0.18em] mb-5">
          Search
        </p>
        <SearchBar
          ref={inputRef}
          value={localQuery}
          onValueChange={setLocalQuery}
          className="w-full"
        />
      </div>

      {showSkeleton && hasQuery ? (
        <SkeletonRows />
      ) : hasQuery ? (
        <>
          <p className="font-serif italic text-muted text-sm mb-6 border-b border-border pb-4">
            {results.length > 0
              ? `${results.length} result${results.length === 1 ? '' : 's'} for '${localQuery.trim()}'`
              : `No results for '${localQuery.trim()}'`
            }
          </p>

          {results.length > 0 ? (
            <div>
              {results.map(({ item, matches }, i) => (
                <ResultRow
                  key={item.id}
                  item={item}
                  matches={matches}
                  staggerIndex={i}
                />
              ))}
            </div>
          ) : (
            <EmptyState query={localQuery.trim()} />
          )}
        </>
      ) : (
        <DefaultPrompt />
      )}

    </div>
  )
}
