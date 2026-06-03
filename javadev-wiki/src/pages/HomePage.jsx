import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCategories } from '../hooks/useCategories'
import SearchBar from '../components/ui/SearchBar'
import CategoryCard from '../components/ui/CategoryCard'

const FEATURED = [
  { slug: 'caching-redis',    sections: 27 },
  { slug: 'networking',       sections: 19 },
  { slug: 'design-patterns',  sections: 14 },
]

/* ─── Hero ────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="pt-16 pb-12 border-b border-border">
      <p className="font-sans text-xs uppercase tracking-[0.18em] text-accent mb-5">
        Senior Java Developer
      </p>

      <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-primary leading-snug tracking-tight mb-4 max-w-2xl">
        The complete backend<br className="hidden sm:block" /> engineering reference
      </h1>

      <p className="font-serif italic text-muted text-base sm:text-lg mb-7 max-w-xl leading-relaxed">
        From core Java fundamentals to distributed systems — curated for
        the modern Java developer.
      </p>

      {/* Stat pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {['13 modules', '60 sections live', '8-week roadmap'].map((s) => (
          <span
            key={s}
            className="font-sans text-xs text-muted border border-border rounded-full px-3 py-1 leading-none"
          >
            {s}
          </span>
        ))}
      </div>

      <SearchBar className="max-w-xl w-full" />
    </section>
  )
}

/* ─── Stats row ───────────────────────────────────────────────── */

const STATS = [
  { value: '13',  label: 'Modules' },
  { value: '60',  label: 'Sections' },
  { value: 'Java 21+', label: 'Platform' },
]

function StatsRow() {
  return (
    <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
      {STATS.map(({ value, label }) => (
        <div key={label} className="py-8 px-4 sm:px-10 text-center">
          <p className="font-serif text-xl sm:text-3xl text-accent font-bold leading-none">
            {value}
          </p>
          <p className="font-sans text-[9px] sm:text-[10px] text-faint mt-2 uppercase tracking-widest">
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}

/* ─── Featured section ────────────────────────────────────────── */

function FeaturedSection({ categories }) {
  const featured = FEATURED
    .map(({ slug, sections }) => {
      const cat = categories.find((c) => c.slug === slug)
      return cat ? { ...cat, sections } : null
    })
    .filter(Boolean)

  if (featured.length === 0) return null

  return (
    <section className="py-12 border-b border-border">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-serif font-bold text-xl text-primary shrink-0">
          Complete content
        </h2>
        <div className="flex-1 h-px bg-border" />
        <span className="font-sans text-xs text-faint shrink-0">
          {featured.length} of 13 ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {featured.map((cat) => (
          <Link
            key={cat.slug}
            to={`/topics/${cat.slug}`}
            className="group block border border-accent/20 hover:border-accent/50 bg-accent/5 hover:bg-accent/10 p-5 rounded-sm transition-colors duration-150"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-2xl leading-none" aria-hidden="true">
                {cat.icon}
              </span>
              <span className="font-sans text-[10px] font-semibold text-accent bg-accent/10 border border-accent/30 rounded px-1.5 py-0.5 leading-none shrink-0">
                Complete
              </span>
            </div>

            <h3 className="font-serif font-bold text-base text-primary leading-snug mb-1">
              {cat.title}
            </h3>

            <p className="font-mono text-xs text-faint mb-4">
              {cat.sections} sections · {cat.estimatedMinutes} min
            </p>

            <span className="font-sans text-xs text-accent group-hover:underline underline-offset-2 transition-colors duration-150">
              View content →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ─── Category grid ───────────────────────────────────────────── */

function CategoryGrid({ categories }) {
  return (
    <section className="py-12 border-b border-border">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-serif font-bold text-xl text-primary shrink-0">All topics</h2>
        <span className="font-mono text-xs text-faint shrink-0 leading-none">I–XIII</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="border border-border overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Roadmap teaser ──────────────────────────────────────────── */

function RoadmapTeaser() {
  return (
    <section className="py-12">
      <div className="border border-border p-6 sm:p-10">
        <p className="font-mono text-[10px] text-faint uppercase tracking-[0.18em] mb-4">
          Study Path
        </p>

        <div className="h-px bg-border mb-6" />

        <p className="font-serif text-base sm:text-lg text-muted leading-relaxed mb-6 max-w-2xl">
          8-week study plan &middot; Week&nbsp;1: Core Java{' '}
          <span className="text-accent">→</span> Week&nbsp;8: Mock Interviews
        </p>

        <Link
          to="/roadmap"
          className="
            inline-flex items-center gap-2
            font-serif italic text-base text-info
            hover:text-primary transition-colors duration-150
            underline underline-offset-4 decoration-border hover:decoration-muted
            min-h-[44px]
          "
        >
          View full roadmap →
        </Link>
      </div>
    </section>
  )
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function HomePage() {
  const categories = useCategories()

  return (
    <>
      <Helmet>
        <title>JavaDev.wiki — Java Backend Engineering Reference</title>
        <meta name="description" content="13 modules covering Core Java through Kubernetes — structured for backend engineers preparing for senior interviews or deepening production knowledge." />
      </Helmet>
      <HeroSection />
      <StatsRow />
      <FeaturedSection categories={categories} />
      <CategoryGrid categories={categories} />
      <RoadmapTeaser />
    </>
  )
}
