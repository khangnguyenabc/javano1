/** @param {{ value: string }} props */
export function TextBlock({ value }) {
  return (
    <p className="font-serif text-base text-muted leading-relaxed mb-4">
      {value}
    </p>
  )
}
