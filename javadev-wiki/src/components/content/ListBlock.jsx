/** @param {{ items: string[] }} props */
export function ListBlock({ items }) {
  return (
    <ul className="list-none p-0 mb-4 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 items-start font-serif italic text-muted text-base leading-relaxed">
          <span className="text-accent not-italic font-sans font-medium shrink-0 mt-0.5 select-none">
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
