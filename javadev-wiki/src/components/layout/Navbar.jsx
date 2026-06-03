import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from '../ui/ThemeToggle'

const NAV_LINKS = [
  { to: '/topics', label: 'Topics' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/search', label: 'Search' },
]

function navLinkClass({ isActive }) {
  return `font-serif italic text-base transition-colors duration-150 ${
    isActive ? 'text-accent' : 'text-muted hover:text-primary'
  }`
}

function mobileLinkClass({ isActive }) {
  return `flex items-center px-6 min-h-[48px] border-b border-border font-serif italic text-lg transition-colors duration-150 ${
    isActive ? 'text-accent' : 'text-muted hover:text-primary'
  }`
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 bg-bg border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[52px] md:h-14">

          {/* Logo */}
          <Link
            to="/"
            onClick={close}
            className="flex items-baseline select-none shrink-0"
          >
            <span className="font-serif font-bold text-primary text-xl leading-none">
              Java
            </span>
            <span className="font-serif font-bold text-accent text-xl leading-none">
              .
            </span>
            <span className="font-serif text-muted text-xl leading-none">
              wiki
            </span>
          </Link>

          {/* Center nav — desktop only */}
          <div className="hidden md:flex items-center gap-8" role="navigation" aria-label="Primary">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            {/* ⌘K badge — desktop only */}
            <span
              className="hidden md:inline-flex items-center gap-0.5 text-xs font-mono text-faint border border-border rounded px-2 py-1 select-none tracking-wide"
              aria-label="Press Command K to search"
            >
              ⌘K
            </span>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 -mr-1 text-xl text-muted hover:text-primary transition-colors duration-150 rounded"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border bg-bg"
          role="navigation"
          aria-label="Mobile"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={mobileLinkClass} onClick={close}>
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
