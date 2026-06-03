import {
  TextBlock,
  SubHeading,
  CodeBlock,
  CalloutBlock,
  ListBlock,
  TableBlock,
} from './index'
import { BadgePill } from './BadgePill'

function renderBlock(block, i) {
  switch (block.type) {
    case 'text':       return <TextBlock key={i} value={block.value} />
    case 'subheading': return <SubHeading key={i} value={block.value} />
    case 'code':       return <CodeBlock key={i} lang={block.lang} value={block.value} />
    case 'warning':    return <CalloutBlock key={i} type="warning" value={block.value} />
    case 'tip':        return <CalloutBlock key={i} type="tip" value={block.value} />
    case 'list':       return <ListBlock key={i} items={block.items} />
    case 'table':      return <TableBlock key={i} headers={block.headers} rows={block.rows} />
    default:           return null
  }
}

/** @param {{ section: { id: string, title: string, badge: string, content: object[] } }} props */
export function SectionBlock({ section }) {
  return (
    <section id={section.id} className="mb-16 scroll-mt-24">
      {/*
        flex-wrap allows the badge to drop to a second line on narrow screens
        rather than squishing the title. items-start keeps baseline alignment
        when they're on the same line.
      */}
      <div className="flex flex-wrap items-start gap-x-3 gap-y-2 mb-6 pb-3 border-b border-border">
        <h2 className="font-serif font-bold text-xl sm:text-2xl text-primary min-w-0 flex-1">
          {section.title}
        </h2>
        <BadgePill badge={section.badge} />
      </div>
      {section.content.map(renderBlock)}
    </section>
  )
}
