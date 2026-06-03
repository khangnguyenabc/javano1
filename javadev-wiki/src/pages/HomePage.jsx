import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCategories } from '../hooks/useCategories'
import SearchBar from '../components/ui/SearchBar'
import CategoryCard from '../components/ui/CategoryCard'

/* ─── Hero ────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="pt-16 pb-12 border-b border-border">
      {/* Eyebrow */}
      <p className="font-sans text-xs uppercase tracking-[0.18em] text-accent mb-5">
        Senior Java Developer
      </p>

      {/* Headline */}
      <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-primary leading-snug tracking-tight mb-4 max-w-2xl">
        The complete backend<br className="hidden sm:block" /> engineering reference
      </h1>

      {/* Subheading */}
      <p className="font-serif italic text-muted text-base sm:text-lg mb-7 max-w-xl leading-relaxed">
        From core Java fundamentals to distributed systems — curated for
        the modern Java developer.
      </p>

      {/* Stat pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {['13 modules', '8-week roadmap'].map((s) => (
          <span
            key={s}
            className="font-sans text-xs text-muted border border-border rounded-full px-3 py-1 leading-none"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Search */}
      <SearchBar className="max-w-xl w-full" />
    </section>
  )
}

/* ─── Stats row ───────────────────────────────────────────────── */

const STATS = [
  { value: '13', label: 'Modules' },
  { value: '8', label: 'Weeks' },
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

/* ─── Category grid ───────────────────────────────────────────── */

function CategoryGrid({ categories }) {
  return (
    <section className="py-12 border-b border-border">
      {/* Section heading */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-serif font-bold text-xl text-primary shrink-0">All topics</h2>
        <span className="font-mono text-xs text-faint shrink-0 leading-none">I–XIII</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Newspaper-style grid — gap-px creates 1px dividers, bg-border is the divider color */}
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
        {/* Label */}
        <p className="font-mono text-[10px] text-faint uppercase tracking-[0.18em] mb-4">
          Study Path
        </p>

        {/* Ruled divider */}
        <div className="h-px bg-border mb-6" />

        {/* Content */}
        <p className="font-serif text-base sm:text-lg text-muted leading-relaxed mb-6 max-w-2xl">
          8-week study plan &middot; Week&nbsp;1: Core Java{' '}
          <span className="text-accent">→</span> Week&nbsp;8: Mock Interviews
        </p>

        {/* CTA */}
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
      <CategoryGrid categories={categories} />
      <RoadmapTeaser />
    </>
  )
}
