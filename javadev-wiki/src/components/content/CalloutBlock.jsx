/**
 * @param {{ type: "warning" | "tip", value: string }} props
 */
export function CalloutBlock({ type, value }) {
  if (type === 'warning') {
    return (
      <div
        className="
          border border-amber-200 dark:border-amber-800
          bg-amber-50 dark:bg-amber-900/20
          p-3 sm:p-4 rounded-r-sm mb-4
        "
        style={{ borderLeftWidth: '3px', borderLeftColor: '#fbbf24' }}
        role="note"
      >
        <p className="font-sans text-sm text-amber-700 dark:text-amber-300 leading-relaxed flex gap-2 items-start">
          <span className="shrink-0 mt-px" aria-label="Warning">⚠️</span>
          <span>{value}</span>
        </p>
      </div>
    )
  }

  return (
    <div
      className="
        border border-green-200 dark:border-green-800
        bg-green-50 dark:bg-green-900/20
        p-3 sm:p-4 rounded-r-sm mb-4
      "
      style={{ borderLeftWidth: '3px', borderLeftColor: '#22c55e' }}
      role="note"
    >
      <p className="font-sans text-sm text-green-700 dark:text-green-300 leading-relaxed flex gap-2 items-start">
        <span className="shrink-0 mt-px" aria-label="Tip">✅</span>
        <span>{value}</span>
      </p>
    </div>
  )
}
