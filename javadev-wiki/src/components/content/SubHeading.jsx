/** @param {{ value: string }} props */
export function SubHeading({ value }) {
  return (
    <h3 className="font-serif font-bold text-xl text-primary border-b border-border pb-2 mt-8 mb-4 leading-snug">
      {value}
    </h3>
  )
}
