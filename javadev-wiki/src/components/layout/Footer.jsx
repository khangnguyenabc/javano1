import { Link } from 'react-router-dom'

const PAGE_LINKS = [
  { to: '/topics', label: 'Topics' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/about', label: 'About' },
]

const TECH_BADGES = ['Java 21+', 'Spring Boot 3', 'Kubernetes']

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

          {/* Col 1: Logo + tagline */}
          <div className="space-y-3">
            <div className="flex items-baseline select-none">
              <span className="font-serif font-bold text-primary text-lg leading-none">
                Java
              </span>
              <span className="font-serif font-bold text-accent text-lg leading-none">
                .
              </span>
              <span className="font-serif text-muted text-lg leading-none">
                wiki
              </span>
            </div>
            <p className="text-sm text-muted font-sans leading-relaxed max-w-[22ch]">
              The complete Java backend reference
            </p>
          </div>

          {/* Col 2: Navigation links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-sans font-medium text-faint uppercase tracking-[0.12em]">
              Navigation
            </h4>
            <ul className="space-y-0">
              {PAGE_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="inline-flex items-center min-h-[44px] text-sm text-muted hover:text-info transition-colors duration-150 font-sans"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Tech stack badges */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-sans font-medium text-faint uppercase tracking-[0.12em]">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {TECH_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center text-xs font-mono text-muted border border-border rounded px-2.5 py-1 bg-bg"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-10 pt-6 text-center">
          <p className="text-xs text-faint font-sans">
            Built for Java developers · 2024
          </p>
        </div>

      </div>
    </footer>
  )
}
