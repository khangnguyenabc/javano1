/** Returns a Tailwind text-color class based on leading emoji in cell value. */
function cellColorClass(cell) {
  if (typeof cell !== 'string') return 'text-muted'
  if (cell.startsWith('✅')) return 'text-green-700 dark:text-green-400'
  if (cell.startsWith('⚠️')) return 'text-amber-600 dark:text-amber-400'
  if (cell.startsWith('❌')) return 'text-red-600 dark:text-red-400'
  return 'text-muted'
}

/**
 * @param {{ headers: string[], rows: string[][] }} props
 */
export function TableBlock({ headers, rows }) {
  return (
    // Negative margins let the scroll track bleed full width on mobile;
    // compensating px-4 keeps content aligned with page text.
    // sm:mx-0 / sm:px-0 restores normal layout on tablet+.
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
      <table className="min-w-max w-full border-collapse font-sans text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-3 py-2 text-primary font-semibold whitespace-nowrap text-xs uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-border last:border-0 hover:bg-surface transition-colors duration-100"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-3 py-2 align-top leading-snug whitespace-nowrap ${cellColorClass(cell)}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
