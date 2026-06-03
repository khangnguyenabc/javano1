import { Link } from 'react-router-dom'
import { categories } from '../data/categories'

/* ─── Data ───────────────────────────────────────────────────── */

const WEEKS = [
  {
    week: 1,
    title: 'Core Java foundations',
    slugs: ['core-java', 'design-patterns'],
    hours: '8–10 hrs',
    description:
      'Language specification, modern Java 17–21, generics, GoF patterns, and SOLID principles.',
  },
  {
    week: 2,
    title: 'JVM internals & concurrency',
    slugs: ['jvm-internals', 'concurrency'],
    hours: '10–12 hrs',
    description:
      'Memory model, GC algorithms, JIT compilation, virtual threads, and CompletableFuture.',
  },
  {
    week: 3,
    title: 'Spring framework & testing',
    slugs: ['spring-ecosystem', 'testing'],
    hours: '10–12 hrs',
    description:
      'IoC/DI internals, Spring Boot auto-configuration, transactions, JUnit 5, and Testcontainers.',
  },
  {
    week: 4,
    title: 'Data layer & API design',
    slugs: ['database-sql', 'api-design'],
    hours: '8–10 hrs',
    description:
      'Index internals, MVCC, isolation levels, connection pooling, REST, GraphQL, and gRPC.',
  },
  {
    week: 5,
    title: 'Security & caching',
    slugs: ['security', 'caching-redis'],
    hours: '8–10 hrs',
    description:
      'JWT, OAuth2 flows, OWASP Top 10, Redis data structures, and high-availability patterns.',
  },
  {
    week: 6,
    title: 'Distributed systems',
    slugs: ['system-design', 'kafka-mq'],
    hours: '12–14 hrs',
    description:
      'CAP theorem, CQRS, event sourcing, Kafka architecture, delivery semantics, and SAGA pattern.',
  },
  {
    week: 7,
    title: 'DevOps & observability',
    slugs: ['devops'],
    hours: '8–10 hrs',
    description:
      'Docker best practices, Kubernetes, Prometheus metrics, and distributed tracing with OpenTelemetry.',
  },
  {
    week: 8,
    title: 'Mock interviews & gap review',
    slugs: [],
    hours: '10–12 hrs',
    description:
      'System design whiteboard sessions, behavioral questions, code review practice, and targeted gap analysis across all 13 modules.',
    isFinal: true,
  },
]

const BOOKS = [
  {
    title: 'Effective Java',
    edition: '3rd Edition',
    author: 'Joshua Bloch',
    category: 'Core Java',
    description:
      'The definitive guide to Java best practices — every Java developer should own this.',
  },
  {
    title: 'Java Concurrency in Practice',
    author: 'Brian Goetz et al.',
    category: 'Concurrency',
    description:
      'The authoritative text on writing correct, performant concurrent programs in Java.',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'System Design',
    description:
      'Comprehensive treatment of distributed systems, storage engines, and data pipelines.',
  },
  {
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    category: 'Architecture',
    description:
      'Timeless principles for organising code and structuring maintainable software systems.',
  },
  {
    title: 'Spring in Action',
    edition: '6th Edition',
    author: 'Craig Walls',
    category: 'Spring',
    description:
      'Hands-on guide to the Spring framework and Spring Boot for enterprise Java applications.',
  },
  {
    title: 'Kubernetes in Action',
    author: 'Marko Lukša',
    category: 'DevOps',
    description:
      'Practical guide to deploying and managing containerised applications with Kubernetes.',
  },
]

const RESOURCES = [
  {
    name: 'Baeldung',
    url: 'https://www.baeldung.com',
    description: 'In-depth tutorials on Java, Spring, and the broader JVM ecosystem.',
  },
  {
    name: 'Oracle Java Documentation',
    url: 'https://docs.oracle.com/en/java/',
    description: 'Official Java SE API reference and language specification.',
  },
  {
    name: 'InfoQ — Java',
    url: 'https://www.infoq.com/java/',
    description: 'News and in-depth articles on the Java platform and ecosystem.',
  },
  {
    name: 'The Spring Blog',
    url: 'https://spring.io/blog',
    description: 'Official Spring team blog with tutorials and release announcements.',
  },
]

/* ─── Category lookup ────────────────────────────────────────── */

const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]))

/* ─── Timeline row ───────────────────────────────────────────── */

function WeekRow({ data, isLast }) {
  const { week, title, slugs, hours, description, isFinal } = data

  return (
    <div className="flex gap-0">
      {/* Left column: week label */}
      <div
        className="
          shrink-0 w-14 sm:w-20
          flex flex-col items-end
          pr-4 sm:pr-6 pt-0.5
        "
      >
        <span
          className={`font-serif text-xs font-medium leading-tight text-right whitespace-nowrap ${
            isFinal ? 'text-primary' : 'text-accent'
          }`}
        >
          Week&nbsp;{week}
        </span>
      </div>

      {/* Right column: content + dashed connector */}
      <div
        className={`
          flex-1 min-w-0 pl-5 sm:pl-6 pb-10 sm:pb-12
          ${!isLast ? 'border-l border-dashed border-border' : ''}
          ${isFinal ? 'border-l-solid border-l-accent/30' : ''}
        `}
      >
        {/* Week header */}
        <div className="flex flex-wrap items-baseline gap-3 mb-2">
          <h2
            className={`font-serif font-bold text-lg leading-snug ${
              isFinal ? 'text-accent' : 'text-primary'
            }`}
          >
            {title}
          </h2>
          <span className="font-sans text-xs text-faint border border-border rounded-full px-2.5 py-0.5">
            {hours}
          </span>
        </div>

        <p className="font-serif italic text-sm text-muted leading-relaxed mb-4">
          {description}
        </p>

        {/* Topic chips */}
        {slugs.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {slugs.map((slug) => {
              const cat = catBySlug[slug]
              if (!cat) return null
              return (
                <Link
                  key={slug}
                  to={`/topics/${slug}`}
                  className="
                    inline-flex items-center gap-1.5
                    font-sans text-xs text-muted
                    border border-border rounded px-2.5 py-1.5
                    hover:border-accent/50 hover:text-accent hover:bg-accent/5
                    transition-colors duration-150
                    min-h-[32px]
                  "
                >
                  <span aria-hidden="true">{cat.icon}</span>
                  {cat.title}
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Link
              to="/topics"
              className="
                inline-flex items-center gap-1.5
                font-sans text-xs text-accent
                border border-accent/30 rounded px-2.5 py-1.5
                hover:bg-accent/5 transition-colors duration-150
                min-h-[32px]
              "
            >
              Review all 13 modules →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Books section ──────────────────────────────────────────── */

function BookRow({ book }) {
  const { title, edition, author, category, description } = book
  return (
    <div className="flex gap-4 items-start py-5 border-b border-border">
      {/* Category badge */}
      <span className="font-sans text-[10px] text-faint border border-border rounded px-2 py-1 leading-none shrink-0 mt-0.5 whitespace-nowrap">
        {category}
      </span>

      {/* Content */}
      <div className="min-w-0">
        <p className="font-serif font-bold italic text-primary leading-snug mb-0.5">
          {title}
          {edition && (
            <span className="font-normal not-italic text-muted font-sans text-xs ml-2">
              {edition}
            </span>
          )}
        </p>
        <p className="font-sans text-xs text-faint mb-1.5">— {author}</p>
        <p className="font-serif italic text-sm text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

/* ─── Resource row ───────────────────────────────────────────── */

function ResourceRow({ resource }) {
  const { name, url, description } = resource
  return (
    <div className="flex gap-4 items-start py-5 border-b border-border">
      <div className="min-w-0 flex-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-serif font-bold text-info hover:underline underline-offset-4 leading-snug"
        >
          {name}
        </a>
        <p className="font-serif italic text-sm text-muted mt-1 leading-relaxed">{description}</p>
      </div>
      <span className="font-mono text-[10px] text-faint shrink-0 pt-1">↗</span>
    </div>
  )
}

/* ─── Section heading ─────────────────────────────────────────── */

function SectionHeading({ label, title }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div>
        <p className="font-mono text-[10px] text-faint uppercase tracking-[0.18em] mb-1">
          {label}
        </p>
        <h2 className="font-serif font-bold text-xl text-primary leading-tight">{title}</h2>
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function RoadmapPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 sm:py-16">

      {/* Page header */}
      <div className="border-b border-border pb-10 mb-12">
        <p className="font-mono text-xs text-faint uppercase tracking-[0.18em] mb-4">
          Study Plan
        </p>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary mb-4 leading-tight tracking-tight">
          8-week study roadmap
        </h1>
        <p className="font-serif italic text-muted text-base sm:text-lg leading-relaxed max-w-xl">
          A structured path from Core Java fundamentals through production DevOps — designed
          to build deep, interview-ready backend engineering knowledge.
        </p>
      </div>

      {/* Timeline */}
      <section className="mb-16">
        <SectionHeading label="Curriculum" title="Week by week" />
        <div>
          {WEEKS.map((week, i) => (
            <WeekRow
              key={week.week}
              data={week}
              isLast={i === WEEKS.length - 1}
            />
          ))}
        </div>
      </section>

      {/* Recommended books */}
      <section className="mb-16">
        <SectionHeading label="Reading" title="Recommended books" />
        <div>
          {BOOKS.map((book) => (
            <BookRow key={book.title} book={book} />
          ))}
        </div>
      </section>

      {/* Online resources */}
      <section className="mb-12">
        <SectionHeading label="Online" title="Resources" />
        <div>
          {RESOURCES.map((r) => (
            <ResourceRow key={r.name} resource={r} />
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <div className="border-t border-border pt-8 text-center">
        <p className="font-serif italic text-muted text-sm mb-4">
          Ready to start? Begin with module I.
        </p>
        <Link
          to="/topics/core-java"
          className="
            inline-flex items-center gap-2 font-serif italic text-accent
            hover:text-primary transition-colors duration-150
            underline underline-offset-4 decoration-accent/40 hover:decoration-primary
          "
        >
          Core Java & Advanced →
        </Link>
      </div>

    </div>
  )
}
