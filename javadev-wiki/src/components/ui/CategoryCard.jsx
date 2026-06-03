import { Link } from 'react-router-dom'

export default function CategoryCard({ category, showBorder = false }) {
  const { slug, module, icon, title, subTopics, tags, estimatedMinutes, difficulty } = category

  return (
    <Link
      to={`/topics/${slug}`}
      className={`
        group flex flex-col p-5 sm:p-6
        bg-bg hover:bg-surface hover:-translate-y-px
        transition-all duration-150
        ${showBorder ? 'border border-border hover:border-muted/50' : ''}
      `}
      style={{ minHeight: '44px' }}
    >
      {/* Module number + meta row */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-accent tracking-wide">{module}</span>
        <div className="flex items-center gap-2">
          <span className="font-sans text-[10px] text-faint uppercase tracking-widest">
            {difficulty}
          </span>
          <span className="font-sans text-[10px] text-faint">·</span>
          <span className="font-sans text-[10px] text-faint">{estimatedMinutes} min</span>
        </div>
      </div>

      {/* Icon + Title */}
      <div className="flex items-start gap-2.5 mb-2">
        <span className="text-base mt-0.5 shrink-0 leading-snug" aria-hidden="true">
          {icon}
        </span>
        <h3 className="font-serif font-bold text-lg text-primary leading-snug">
          {title}
        </h3>
      </div>

      {/* Sub-topics list */}
      <p className="font-serif italic text-sm text-muted mb-5 leading-relaxed">
        {subTopics.join(', ')}
      </p>

      {/* Bottom row: tags + arrow */}
      <div className="flex items-center justify-between gap-4 mt-auto">
        <div className="flex flex-wrap gap-1.5 min-w-0">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-sans text-[11px] text-muted border border-border rounded px-1.5 py-0.5 whitespace-nowrap leading-none"
            >
              {tag}
            </span>
          ))}
        </div>
        <span
          className="font-serif text-muted group-hover:text-accent transition-colors duration-150 shrink-0 text-base"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </Link>
  )
}
