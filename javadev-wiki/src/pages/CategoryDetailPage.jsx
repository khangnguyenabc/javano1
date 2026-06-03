import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCategoryBySlug } from '../hooks/useCategories'
import { useProgress } from '../context/ProgressContext'
import Breadcrumb from '../components/ui/Breadcrumb'
import { redisData } from '../data/redis'
import { networkingData } from '../data/networking'
import { SectionBlock } from '../components/content/SectionBlock'
import { RedisTOC } from '../components/content/RedisTOC'

/* ─── Utilities ─────────────────────────────────────────────── */

function topicToId(topic) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/* ─── Completion progress bar (generic pages) ───────────────── */

function ProgressBar({ done, total }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-xs text-faint">
          {done}&thinsp;/&thinsp;{total} completed
        </span>
        <span className="font-sans text-xs text-faint">{pct}%</span>
      </div>
      <div className="h-0.5 bg-border overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ─── Article hero — shared by Redis & Networking pages ─────── */

function ArticleHero({ data, scrollPct }) {
  return (
    <>
      <nav
        className="font-sans text-xs sm:text-sm text-faint mb-6 min-w-0"
        aria-label="Breadcrumb"
      >
        <span className="inline-flex items-center flex-wrap gap-0.5 min-w-0">
          <Link to="/" className="hover:text-primary transition-colors duration-150 shrink-0">
            Home
          </Link>
          <span className="mx-2 shrink-0" aria-hidden="true">/</span>
          <Link to="/topics" className="hover:text-primary transition-colors duration-150 shrink-0">
            Topics
          </Link>
          <span className="mx-2 shrink-0" aria-hidden="true">/</span>
          <span className="text-primary truncate">{data.title}</span>
        </span>
      </nav>

      <div className="border-b border-border mb-10">
        <p className="font-serif text-accent text-lg font-bold">{data.module}</p>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-primary tracking-tight mt-2 mb-4 leading-tight">
          {data.title}
        </h1>

        <p className="font-serif italic text-muted text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
          {data.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="font-sans text-xs border border-border text-muted px-2.5 py-1 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:flex sm:flex-wrap sm:gap-8 md:gap-12 gap-4 pt-6 border-t border-border pb-8">
          {data.stats.map(({ num, label }) => (
            <div key={label}>
              <p className="font-serif text-3xl font-bold text-accent leading-none">{num}</p>
              <p className="font-mono text-xs uppercase tracking-widest text-faint mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Hero-bottom reading indicator — subtle gradient line */}
        <div className="h-0.5 w-full bg-border overflow-hidden">
          <div
            className="h-full"
            style={{
              width: `${scrollPct}%`,
              background: 'linear-gradient(to right, #d85a30, #e8763a)',
              transition: 'width 100ms linear',
            }}
          />
        </div>
      </div>
    </>
  )
}

/* ─── Desktop sidebar TOC (generic pages) ───────────────────── */

function DesktopTOC({ subTopics, activeId }) {
  return (
    <div className="sticky top-20">
      <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-faint mb-4 select-none">
        Contents
      </p>
      <ul className="space-y-0">
        {subTopics.map((topic) => {
          const id = topicToId(topic)
          const isActive = activeId === id
          return (
            <li key={topic}>
              <a
                href={`#${id}`}
                className={`
                  block py-1.5 pl-3 text-sm font-sans leading-snug
                  border-l-2 transition-colors duration-150
                  ${
                    isActive
                      ? 'text-accent font-medium border-l-accent'
                      : 'text-muted hover:text-primary border-l-transparent hover:border-l-border'
                  }
                `}
              >
                {topic}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ─── Mobile TOC accordion (generic pages) ──────────────────── */

function MobileTOC({ subTopics }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-border mb-8">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 font-sans text-sm min-h-[44px]"
        aria-expanded={open}
      >
        <span className="font-medium text-primary">Contents</span>
        <span className="text-faint text-xs select-none">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="border-t border-border px-4 py-2">
          {subTopics.map((topic) => (
            <a
              key={topic}
              href={`#${topicToId(topic)}`}
              onClick={() => setOpen(false)}
              className="flex items-center py-2 text-sm text-muted hover:text-primary font-sans min-h-[44px] transition-colors duration-150"
            >
              {topic}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Mark-done button (generic pages) ──────────────────────── */

function MarkDoneButton({ isDone, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`
        inline-flex items-center gap-2.5 px-4 py-3 text-sm font-sans border
        transition-all duration-200 min-h-[44px] rounded-sm
        ${
          isDone
            ? 'border-accent/40 bg-accent/10 text-accent'
            : 'border-border text-muted bg-bg hover:border-accent/40 hover:text-accent hover:bg-accent/5'
        }
      `}
    >
      {isDone ? (
        <>
          <span className="text-base leading-none">✓</span>
          <span>Completed</span>
        </>
      ) : (
        <>
          <span className="text-base leading-none text-faint">○</span>
          <span>Mark as done</span>
        </>
      )}
    </button>
  )
}

/* ─── Sub-topic section (generic pages) ─────────────────────── */

function SubTopicSection({ topic, slug, isDone, onMark, onUnmark, innerRef }) {
  const id = topicToId(topic)

  return (
    <section id={id} ref={innerRef} className="mb-12 scroll-mt-20">
      <h2 className="font-serif font-bold text-xl text-primary border-b border-border py-3 mb-5 leading-snug">
        {topic}
      </h2>

      <div className="border border-dashed border-border rounded-sm p-5 sm:p-6 mb-6 bg-surface/50">
        <p className="font-serif italic text-muted text-sm leading-relaxed">
          In-depth notes on <em>{topic}</em> will appear here — covering core concepts,
          annotated code examples, interview question patterns, and common pitfalls to avoid.
        </p>
      </div>

      <MarkDoneButton
        isDone={isDone}
        onToggle={() => (isDone ? onUnmark(slug, topic) : onMark(slug, topic))}
      />
    </section>
  )
}

/* ─── Placeholder references ────────────────────────────────── */

const PLACEHOLDER_REFS = [
  'Official Java documentation — docs.oracle.com/en/java/',
  'Effective Java, 3rd Edition — Joshua Bloch',
  'Java Concurrency in Practice — Brian Goetz et al.',
]

/* ─── Page ──────────────────────────────────────────────────── */

export default function CategoryDetailPage() {
  const { slug } = useParams()
  const category = useCategoryBySlug(slug)
  const { getProgressForCategory, markDone, markUndone } = useProgress()

  const [activeId, setActiveId] = useState(null)
  const [scrollPct, setScrollPct] = useState(0)
  const sectionRefs = useRef({})

  // Reading progress — shared by both page variants
  useEffect(() => {
    function onScroll() {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking for generic sidebar TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      // -64px top offsets the sticky navbar; -60% bottom means only near-top sections activate
      { rootMargin: '-64px 0px -60% 0px', threshold: 0 }
    )

    const refs = sectionRefs.current
    Object.values(refs).forEach((el) => el && observer.observe(el))

    return () => observer.disconnect()
  }, [slug])

  const pageData = slug === 'caching-redis'  ? redisData
                 : slug === 'networking'      ? networkingData
                 : null

  /* ── 404 ──────────────────────────────────────────────────── */

  if (!category) {
    return (
      <div className="py-16 sm:py-24">
        <p className="font-mono text-xs text-faint uppercase tracking-[0.18em] mb-4">404</p>
        <h1 className="font-serif font-bold text-3xl text-primary mb-3">Topic not found</h1>
        <p className="font-sans text-muted mb-8">
          No category matches{' '}
          <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">{slug}</code>
        </p>
        <Link
          to="/topics"
          className="font-sans text-sm text-info hover:underline underline-offset-4"
        >
          ← Back to all topics
        </Link>
      </div>
    )
  }

  /* ── Full-content article page (Redis, Networking, …) ────── */

  if (pageData) {
    return (
      <>
        <Helmet>
          <title>{pageData.title} — JavaDev.wiki</title>
          <meta name="description" content={pageData.description} />
        </Helmet>

        {/* Reading progress — fixed just below navbar (52px mobile / 56px desktop) */}
        <div
          className="fixed top-[52px] md:top-14 left-0 right-0 z-20 h-0.5 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="h-full bg-accent"
            style={{ width: `${scrollPct}%`, transition: 'width 100ms linear' }}
          />
        </div>

        <div className="py-8 sm:py-12">
          <ArticleHero data={pageData} scrollPct={scrollPct} />

          {/* Mobile TOC + metadata — hidden on md+ */}
          <div className="md:hidden mb-8">
            <RedisTOC sections={pageData.sections} />
            <p className="font-mono text-xs text-faint mt-2">
              {pageData.sections.length} sections · ~{category.estimatedMinutes} min read
            </p>
          </div>

          {/* Main 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">

            {/* Sidebar TOC — sticky, desktop only */}
            <aside className="hidden md:block">
              <RedisTOC sections={pageData.sections} />
            </aside>

            {/* Article content */}
            <article>
              {pageData.sections.map((section) => (
                <SectionBlock key={section.id} section={section} />
              ))}

              {/* Bottom navigation */}
              <div className="border-t border-border pt-8 mt-16 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <a
                  href="/topics"
                  className="font-serif text-muted hover:text-accent transition-colors duration-150 min-h-[44px] inline-flex items-center"
                >
                  ← Back to all topics
                </a>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="font-sans text-xs text-faint hover:text-muted transition-colors duration-150 min-h-[44px] flex items-center self-start sm:self-auto"
                >
                  ↑ Back to top
                </button>
              </div>
            </article>

          </div>
        </div>
      </>
    )
  }

  /* ── Generic category page ────────────────────────────────── */

  const done = getProgressForCategory(slug)

  return (
    <div className="py-8 sm:py-12">
      <Helmet>
        <title>{category.title} — JavaDev.wiki</title>
        <meta name="description" content={category.subtitle} />
      </Helmet>

      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Topics', to: '/topics' },
          { label: category.title },
        ]}
      />
      <ProgressBar done={done.length} total={category.subTopics.length} />

      {/* Mobile TOC */}
      <div className="md:hidden">
        <MobileTOC subTopics={category.subTopics} />
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row md:gap-12 items-start">

        {/* Sidebar — desktop */}
        <aside className="hidden md:block w-56 shrink-0">
          <DesktopTOC subTopics={category.subTopics} activeId={activeId} />
        </aside>

        {/* Main article */}
        <article className="flex-1 min-w-0 w-full">

          {/* Article header */}
          <header className="mb-10 pb-8 border-b border-border">
            <p className="font-mono text-xs text-accent uppercase tracking-[0.18em] mb-3">
              Module {category.module}
            </p>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary leading-snug tracking-tight mb-4">
              <span aria-hidden="true">{category.icon} </span>
              {category.title}
            </h1>
            <p className="font-serif italic text-muted text-base sm:text-lg leading-relaxed mb-6 max-w-prose">
              {category.description}
            </p>

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="font-sans text-xs text-faint border border-border rounded-full px-3 py-1">
                {category.estimatedMinutes} min read
              </span>
              <span className="font-sans text-xs text-faint border border-border rounded-full px-3 py-1 capitalize">
                {category.difficulty}
              </span>
              <span className="font-sans text-xs text-faint border border-border rounded-full px-3 py-1">
                Week {category.weekInRoadmap}
              </span>
            </div>

            {/* Tag chips */}
            <div className="flex flex-wrap gap-1.5">
              {category.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-sans text-[11px] text-muted border border-border rounded px-1.5 py-0.5 leading-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Sub-topic sections */}
          {category.subTopics.map((topic) => (
            <SubTopicSection
              key={topic}
              topic={topic}
              slug={slug}
              isDone={done.includes(topic)}
              onMark={markDone}
              onUnmark={markUndone}
              innerRef={(el) => {
                sectionRefs.current[topicToId(topic)] = el
              }}
            />
          ))}

          {/* References */}
          <section className="border-t border-border pt-8 mt-2 mb-12">
            <h2 className="font-serif font-bold text-xl text-primary mb-6">References</h2>
            <ul className="space-y-3">
              {PLACEHOLDER_REFS.map((ref) => (
                <li
                  key={ref}
                  className="font-serif italic text-sm text-muted pl-4 border-l-2 border-border leading-relaxed"
                >
                  {ref}
                </li>
              ))}
            </ul>
          </section>

          {/* Footer nav */}
          <div className="border-t border-border pt-6 pb-12">
            <Link
              to="/topics"
              className="inline-flex items-center gap-2 font-sans text-sm text-info hover:text-primary transition-colors duration-150 min-h-[44px] underline-offset-4 hover:underline"
            >
              ← Back to all topics
            </Link>
          </div>

        </article>
      </div>
    </div>
  )
}
