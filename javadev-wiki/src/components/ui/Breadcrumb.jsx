import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 font-sans text-sm text-muted mb-6">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && (
            <span className="text-faint mx-0.5 select-none" aria-hidden="true">
              /
            </span>
          )}
          {item.to ? (
            <Link
              to={item.to}
              className="hover:text-primary transition-colors duration-150"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-primary font-medium truncate max-w-[200px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
