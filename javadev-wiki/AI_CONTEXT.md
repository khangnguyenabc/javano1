# AI_CONTEXT.md — JavaDev.wiki

> Đọc file này trước tiên. Nó thay thế việc phải đọc lại toàn bộ source code.
> Cập nhật file này mỗi khi thêm tính năng lớn.

---

## 1. Tổng quan dự án

| Mục | Giá trị |
|---|---|
| Tên | JavaDev.wiki |
| Mô tả | Knowledge base cho Java backend engineer — 13 module, 8-tuần roadmap |
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 (custom tokens qua CSS variables) |
| Routing | React Router v7 (createBrowserRouter) |
| SEO | react-helmet-async |
| Search | Fuse.js (fuzzy search, client-side) |
| Fonts | Lora (serif) · DM Sans (sans) · JetBrains Mono (mono) — Google Fonts |
| Theme | Light/Dark — toggle bằng class `.dark` trên `<html>` |
| State | React Context (không có Redux/Zustand) |
| Persistence | localStorage (theme + learning progress) |
| Deploy | Static SPA — không có backend, không có API calls |

---

## 2. Cấu trúc thư mục

```
javadev-wiki/
├── src/
│   ├── main.jsx                    # Entry point — StrictMode + App
│   ├── App.jsx                     # Provider stack: Helmet > Theme > Progress > Router
│   ├── router.jsx                  # createBrowserRouter — 6 routes
│   ├── index.css                   # CSS tokens + Tailwind directives + base styles
│   │
│   ├── data/
│   │   ├── categories.js           # 14 category objects (SINGLE SOURCE OF TRUTH)
│   │   ├── redis.js                # redisData — 27 sections cho /topics/caching-redis
│   │   ├── networking.js           # networkingData — 19 sections cho /topics/networking
│   │   └── designPatterns.js       # designPatternsData — 14 sections cho /topics/design-patterns
│   │
│   ├── context/
│   │   ├── ThemeContext.jsx        # theme, toggle, isDark — localStorage key: javadev-theme
│   │   └── ProgressContext.jsx     # markDone/markUndone/getProgressForCategory — key: javadev-progress
│   │
│   ├── hooks/
│   │   └── useCategories.js        # useCategories() → array; useCategoryBySlug(slug) → object|undefined
│   │
│   ├── pages/
│   │   ├── HomePage.jsx            # Hero + Stats(60) + FeaturedSection(3 complete) + CategoryGrid + RoadmapTeaser
│   │   ├── CategoryListPage.jsx    # Filter tabs + rows sorted (detail-ready first) + Complete/Coming soon badges
│   │   ├── CategoryDetailPage.jsx  # ⚠️ TRIPLE BEHAVIOR (xem mục 6)
│   │   ├── SearchPage.jsx          # Fuse.js — index categories + 60 sections; section results link to #anchor
│   │   ├── RoadmapPage.jsx         # Timeline 8 tuần + Books + Resources (static data)
│   │   └── NotFoundPage.jsx        # 404
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx          # Navbar + <main max-w-6xl> + Footer + ScrollToTop
│   │   │   ├── Navbar.jsx          # Sticky top-0 z-50, h-[52px] md:h-14, hamburger mobile
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── CategoryCard.jsx    # Card dùng ở HomePage grid (2 cols)
│   │   │   ├── SearchBar.jsx       # forwardRef, controlled/uncontrolled, navigate on submit
│   │   │   ├── Breadcrumb.jsx      # items: [{label, to?}] — Link nếu có to, span nếu không
│   │   │   ├── ThemeToggle.jsx     # Sun/Moon SVG icon button
│   │   │   └── ScrollToTop.jsx     # Fixed bottom-right, hiện sau scroll 400px
│   │   │
│   │   └── content/               # Dùng cho tất cả detail pages (Redis, Networking, Design Patterns)
│   │       ├── index.js            # Barrel export tất cả content components
│   │       ├── TextBlock.jsx       # <p> font-serif text-muted
│   │       ├── SubHeading.jsx      # <h3> font-serif bold, border-b
│   │       ├── CalloutBlock.jsx    # type="warning"|"tip" — amber/green với left-border 3px
│   │       ├── ListBlock.jsx       # <ul> list-none, em dash (—) in accent color
│   │       ├── TableBlock.jsx      # overflow-x-auto -mx-4 px-4, min-w-max (mobile scroll)
│   │       ├── CodeBlock.jsx       # Dark bg #1a1a18, copy button, lang badge, min-h-[44px]
│   │       ├── BadgePill.jsx       # Colored pill — xem mục 8 để biết full color map
│   │       ├── SectionBlock.jsx    # Render 1 section với header + BadgePill + content[] (8 types)
│   │       └── RedisTOC.jsx        # Desktop sticky sidebar + Mobile accordion (grid-rows animation)
│   │
│   └── assets/
│       └── hero.png
```

---

## 3. Design System — Tokens & Typography

### CSS Variables (`src/index.css`)

```css
/* Light mode (default) */
--color-primary: 26 26 24;        /* #1a1a18 — văn bản chính */
--color-muted:   95 94 90;        /* #5f5e5a — văn bản phụ */
--color-faint:   136 135 128;     /* #888780 — labels, meta */
--color-border:  229 228 220;     /* #e5e4dc — đường kẻ */
--color-surface: 244 243 238;     /* #f4f3ee — nền card/hover */
--color-bg:      250 250 248;     /* #fafaf8 — nền trang */
--color-accent:  216 90 48;       /* #d85a30 — coral (active, highlight) */
--color-info:    29 111 164;      /* #1d6fa4 — links */

/* Dark mode (.dark class trên <html>) */
--color-primary: 230 237 243;     /* #e6edf3 */
--color-surface: 22 27 34;        /* #161b22 */
--color-bg:      13 17 23;        /* #0d1117 */
/* accent giữ nguyên #d85a30 cả 2 mode */
```

Dùng trong Tailwind: `text-primary`, `bg-surface`, `border-border`, `text-accent`, `text-muted`, `text-faint`, `text-info`.

### Typography Convention

| Class | Font | Dùng cho |
|---|---|---|
| `font-serif` | Lora | Headings, body text, descriptions |
| `font-sans` | DM Sans | UI labels, tags, meta info, buttons |
| `font-mono` | JetBrains Mono | Code, TOC titles, module numbers |

**Code blocks**: background luôn là `#1a1a18`, text `#f5f1eb` — không đổi theo theme.

### Touch Targets (Mobile)
- Buttons/links: `min-h-[44px]` (Apple HIG)
- TOC mobile button: `min-h-[48px]`
- TOC mobile links: `min-h-[40px]`

---

## 4. Data Layer

### `src/data/categories.js` — 14 categories

Mỗi category object có:
```js
{
  id: number,
  slug: string,           // URL segment: /topics/:slug
  title: string,
  subtitle: string,
  module: string,         // 'I.' đến 'XIV.' (14 modules thực tế)
  tags: string[],         // hiện tối đa 3 ở UI
  subTopics: string[],    // dùng cho generic detail page
  description: string,
  color: string,          // Tailwind color name (không dùng nhiều)
  icon: string,           // emoji
  estimatedMinutes: number,
  difficulty: 'intermediate' | 'advanced',
  weekInRoadmap: number,
}
```

Accessed qua hook `useCategories()` (sync, không async).

### Detail page data files — cấu trúc chung

Cả 3 file (`redis.js`, `networking.js`, `designPatterns.js`) cùng schema:
```js
{
  slug: string,
  module: string,
  title: string,
  description: string,
  tags: string[],
  stats: [{ num: string, label: string }],  // 3 stats cho hero
  sections: [
    {
      id: string,        // anchor id — dùng cho TOC + scroll + search
      title: string,
      badge: string,     // xem BadgePill color map ở mục 8
      content: ContentBlock[]
    }
  ]
}
```

| File | slug | Sections | Badges dùng |
|---|---|---|---|
| `redis.js` | `caching-redis` | 27 | Core concept, Pattern, Production, Redis 5+/6+/7+, Redis Stack, Reference |
| `networking.js` | `networking` | 19 | Core concept, Advanced, Production, Reference |
| `designPatterns.js` | `design-patterns` | 14 | Core concept, GoF Patterns, Architecture, Enterprise Patterns, DDD, Reference |

**ContentBlock types** (8 types — tất cả handled bởi SectionBlock):
```js
{ type: 'text',       value: string }
{ type: 'subheading', value: string }
{ type: 'code',       lang: string, value: string }
{ type: 'warning',    value: string }
{ type: 'tip',        value: string }
{ type: 'list',       items: string[] }
{ type: 'table',      headers: string[], rows: string[][] }
{ type: 'grid',       items: [{ title: string, body: string }] }
```

**Code langs được dùng**: `java`, `redis`, `bash`, `python`, `lua`, `properties`, `text`, `cisco` — CodeBlock không có whitelist, nhận bất kỳ string nào.

---

## 5. Routing

```
/                     → HomePage
/topics               → CategoryListPage
/topics/:slug         → CategoryDetailPage (DUAL BEHAVIOR — xem mục 6)
/search               → SearchPage (?q= sync với URL)
/roadmap              → RoadmapPage
*                     → NotFoundPage
```

Layout wrapper (`Layout.jsx`) bao gồm:
- `<Navbar />` — sticky top-0 z-50
- `<main className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">` — đã có container
- `<Footer />`
- `<ScrollToTop />` — global, fixed bottom-right

**Quan trọng**: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8` là của Layout. Các page KHÔNG thêm lại container này.

---

## 6. CategoryDetailPage — Triple Behavior (QUAN TRỌNG)

File `src/pages/CategoryDetailPage.jsx` xử lý 3 loại trang:

```js
const pageData = slug === 'caching-redis'   ? redisData
               : slug === 'networking'       ? networkingData
               : slug === 'design-patterns'  ? designPatternsData
               : null
```

### Branch 1: Full-content Article Page (`pageData !== null`)

Áp dụng cho: `caching-redis`, `networking`, `design-patterns`

```
├── <Helmet> title: "{pageData.title} — JavaDev.wiki"
├── Fixed reading progress bar: top-[52px] md:top-14
│   └── barColor: #d85a30 (Redis/Networking) | #ec4899 (Design Patterns — pink)
└── <div py-8 sm:py-12>
    ├── <ArticleHero data={pageData} scrollPct={scrollPct}>
    │   ├── Breadcrumb (inline nav — Home / Topics / title)
    │   ├── module + h1 + description + tags
    │   ├── Stats grid (3 items)
    │   └── Hero bottom: gradient progress indicator
    ├── Mobile (md:hidden):
    │   ├── <RedisTOC sections={pageData.sections} />
    │   └── "{n} sections · ~{estimatedMinutes} min read"
    └── Grid md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] gap-8 lg:gap-12
        ├── <aside hidden md:block>
        │   └── <RedisTOC sections={pageData.sections} />
        └── <article>
            ├── {pageData.sections.map(s => <SectionBlock section={s} />)}
            └── Bottom nav: flex-col sm:flex-row — "← Back" + "↑ Back to top"
```

### Branch 2: Generic Category Page (tất cả slugs còn lại)

```
├── <Helmet> title: "{category.title} — JavaDev.wiki"
├── <Breadcrumb> + <ProgressBar>
├── Mobile: <MobileTOC subTopics> (accordion)
└── Flex md:flex-row gap-12
    ├── <aside> <DesktopTOC subTopics activeId>
    └── <article>
        ├── Header: module + h1 + description + meta pills + tags
        ├── {subTopics.map → <SubTopicSection>}  ← placeholder + MarkDoneButton
        ├── References (PLACEHOLDER_REFS)
        └── Footer nav
```

**State dùng chung** (hooks không conditional):
- `scrollPct` — window.scrollY / total scroll height × 100
- `activeId` — IntersectionObserver cho generic TOC (`rootMargin: '-64px 0px -60% 0px'`)
- `sectionRefs` — ref map cho generic sections

---

## 7. Context Providers

### ThemeContext
```js
// Hook:
const { theme, toggle, isDark } = useTheme()
// Lưu: localStorage key 'javadev-theme'
// Áp dụng: class 'dark' trên document.documentElement
// Default: theo prefers-color-scheme
```

### ProgressContext
```js
// Hook:
const { markDone, markUndone, getProgressForCategory } = useProgress()

// markDone(categorySlug, subTopic)    → thêm vào array
// markUndone(categorySlug, subTopic)  → xóa khỏi array
// getProgressForCategory(slug)        → string[] (sub-topics đã done)

// Lưu: localStorage key 'javadev-progress'
// Shape: { [slug]: string[] }
```

---

## 8. Content Components (chỉ dùng cho Redis page)

Tất cả export từ `src/components/content/index.js`.

### TextBlock `{ value }`
`<p className="font-serif text-base text-muted leading-relaxed mb-4">`

### SubHeading `{ value }`
`<h3>` font-serif bold text-xl, border-b border-border, pb-2 mt-8 mb-4

### CalloutBlock `{ type: "warning"|"tip", value }`
- warning: amber-50 bg, amber-200 border, left-border 3px amber-400, icon ⚠️
- tip: green-50 bg, green-200 border, left-border 3px green-500, icon ✅
- Padding: `p-3 sm:p-4` (mobile tighter)
- Dark mode: amber/green 900/20 bg, 300 text

### ListBlock `{ items: string[] }`
`<ul>` list-none, mỗi `<li>` có "—" trong `text-accent`, font-serif italic text-muted

### TableBlock `{ headers, rows }`
- Wrapper: `overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6` (mobile horizontal scroll)
- Table: `min-w-max w-full` + `whitespace-nowrap` trên td
- Emoji cell color: ✅ green-700, ⚠️ amber-600, ❌ red-600

### CodeBlock `{ lang, value }`
- Wrapper: `relative mb-6 rounded-sm overflow-hidden border border-border`
- Header bar: `min-h-[44px]` — lang badge (font-mono xs) + Copy button (min-h-[44px])
- Code area: bg `#1a1a18`, text `#f5f1eb`, `white-space: pre`, `word-break: normal`, `overflow-x: auto`
- Copy button: copies to clipboard, hiện "Copied!" 2 giây rồi về "Copy"

### BadgePill `{ badge }`
Colored rounded pill. Full color map (fallback: gray):

| Badge | Color |
|---|---|
| Core concept | amber |
| Production | red |
| Pattern | blue |
| Redis 5+ / Redis 6+ | purple |
| Redis 7+ | violet |
| Redis Stack | teal |
| Reference | gray |
| GoF Patterns | pink |
| Architecture | indigo |
| Enterprise Patterns | rose |
| DDD | emerald |
| Advanced | sky |

### SectionBlock `{ section: {id, title, badge, content[]} }`
- `<section id={section.id} scroll-mt-24 mb-16>`
- Header: `flex flex-wrap items-start gap-x-3 gap-y-2 border-b`
- `<h2 className="text-xl sm:text-2xl font-serif font-bold text-primary min-w-0 flex-1">`
- `<BadgePill badge={section.badge} />` — wrap xuống dòng nếu không đủ chỗ
- Dispatch `content[]` qua `renderBlock` switch

### RedisTOC `{ sections: [{id, title, badge}] }`
Dùng chung cho cả 3 detail pages (Redis 27, Networking 19, Design Patterns 14 sections).
- **Desktop** (`hidden md:block`): `sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto`
  - Active link: `text-accent border-l-2 border-accent bg-surface font-medium`
  - IntersectionObserver threshold 0.3
- **Mobile** (`md:hidden`): accordion button `min-h-[48px]`
  - Smooth animation: `grid-rows-[0fr→1fr]` CSS transition (không dùng conditional render)
  - Nội dung: `max-h-72 overflow-y-auto` (72 để chứa đủ 14–27 sections), `grid grid-cols-2`
  - Mỗi link: `min-h-[40px] flex items-center`
  - Caret xoay 180° khi mở bằng `rotate-180`

---

## 9. Mobile QA — Các fix đã áp dụng

Target: 375px (iPhone SE). Tất cả đã fix và verified bằng Playwright:

| Component | Vấn đề | Fix |
|---|---|---|
| `TableBlock` | Bảng squish | `-mx-4 px-4 sm:mx-0 sm:px-0` + `min-w-max` + `whitespace-nowrap` |
| `CodeBlock` | Copy button nhỏ | Header `min-h-[44px]`, button `min-h-[44px]` |
| `CodeBlock` | Text wrap trong code | `word-break: normal`, `overflow-wrap: normal` |
| `CalloutBlock` | Padding quá lớn | `p-3 sm:p-4` |
| `SectionBlock` | h2 quá to, badge tràn | `text-xl sm:text-2xl`, `flex-wrap items-start` |
| `RedisTOC` | Button nhỏ | `min-h-[48px]` |
| `RedisTOC` | Accordion giật | `grid-rows-[0fr→1fr]` CSS transition |
| `RedisTOC` | Overflow cho 14–27 sections | `max-h-72` (tăng từ max-h-64) |
| `CategoryDetailPage` | Description quá to | `text-base sm:text-lg` |
| `CategoryDetailPage` | Bottom nav ngang | `flex-col sm:flex-row gap-3` |
| `index.css` | Page horizontal scroll | `overflow-x: hidden` trên body |

---

## 10. Patterns & Conventions

### Animation
```css
/* Fade in khi route change — áp dụng trên <main> trong Layout */
animate-fade-in

/* Stagger fade-up cho list items */
animate-fade-up + style={{ animationDelay: `${i * 40}ms` }}
```

### Active TOC detection
- Generic pages: `IntersectionObserver` với `rootMargin: '-64px 0px -60% 0px'`
- Redis TOC: `IntersectionObserver` với `threshold: 0.3`

### Scroll progress bar (Redis page chỉ)
```js
const total = document.documentElement.scrollHeight - window.innerHeight
setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0)
// Fixed position: top-[52px] md:top-14 (khớp navbar height)
```

### Grid-rows CSS animation trick (RedisTOC mobile)
```jsx
// Smooth collapse không cần đo height bằng JS
<div className={`grid transition-[grid-template-rows] duration-200 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
  <div className="min-h-0 overflow-hidden">   {/* min-h-0 critical */}
    {/* content */}
  </div>
</div>
```

### SearchBar — Controlled/Uncontrolled
- Uncontrolled (HomePage): chỉ cần `<SearchBar />`, submit → navigate `/search?q=`
- Controlled (SearchPage): `value={query}` + `onValueChange={setQuery}` + `ref={inputRef}`

### Navbar height reference
- Mobile: `h-[52px]` → offset `top-[52px]`
- Desktop: `h-14` (56px) → offset `top-14`
- TOC sticky: `top-24` (96px = navbar + breathing room)

---

## 11. Thêm module mới (checklist)

1. Thêm object vào `src/data/categories.js` với slug, module, subTopics...
2. Nếu là trang full-content: tạo `src/data/{slug}.js` với cấu trúc `{ slug, module, title, description, tags, stats, sections[] }`
3. Trong `CategoryDetailPage.jsx`: thêm branch vào `pageData` const:
   ```js
   const pageData = slug === 'caching-redis'   ? redisData
                  : slug === 'networking'       ? networkingData
                  : slug === 'design-patterns'  ? designPatternsData
                  : slug === '{new-slug}'       ? newData   // ← thêm đây
                  : null
   ```
   Và thêm `barColor` nếu muốn màu khác.
4. Trong `SearchPage.jsx`: import data file mới và thêm vào `sectionItems`:
   ```js
   const sectionItems = [
     ...buildSectionItems(redisData),
     ...buildSectionItems(networkingData),
     ...buildSectionItems(designPatternsData),
     ...buildSectionItems(newData),   // ← thêm đây
   ]
   ```
5. Trong `HomePage.jsx`: thêm slug vào const `FEATURED` với section count.
6. Trong `CategoryListPage.jsx`: thêm slug vào `DETAIL_SLUGS` Set.
7. Không cần thêm route — `topics/:slug` đã bao phủ tất cả.
8. Badge mới → thêm vào `BadgePill.jsx` colorMap.

---

## 12. SearchPage — Section Indexing (QUAN TRỌNG)

`src/pages/SearchPage.jsx` index cả categories lẫn sections từ 3 data files.

**Corpus** (module-level, khởi tạo 1 lần):
```js
const categoryItems = categories.map(c => ({ type: 'category', ...c }))
const sectionItems  = [
  ...buildSectionItems(redisData),       // 27 items
  ...buildSectionItems(networkingData),  // 19 items
  ...buildSectionItems(designPatternsData), // 14 items
]
const corpus = [...categoryItems, ...sectionItems]  // 74 items total
```

**Section item shape**:
```js
{
  type: 'section',
  id: '{slug}#{sectionId}',   // React key
  slug, sectionId,
  title, badge,
  tags: [badge],
  parentTitle,                 // "Caching — Redis Advanced" etc.
  content: string,             // extracted từ text/subheading/warning/tip/list blocks
}
```

**Fuse keys** (weighted): `title` 0.4 → `tags` 0.2 → `content` 0.2 → `subtitle` 0.1 → `subTopics` 0.05 → `parentTitle` 0.05. Threshold 0.35.

**Result rendering**:
- `type === 'category'` → `CategoryResultRow` (module numeral, tags với highlight)
- `type === 'section'` → `SectionResultRow` (§ glyph, badge chip, "in {parentTitle}", link tới `/topics/{slug}#{sectionId}`)

---

## 13. Files KHÔNG nên đọc lại

| File | Lý do |
|---|---|
| `src/data/categories.js` | Schema đã documented ở mục 4 |
| `src/data/redis.js` | Structure đã documented ở mục 4 (file dài 1200+ dòng) |
| `src/data/networking.js` | Cùng structure, 19 sections (dài ~1100 dòng) |
| `src/data/designPatterns.js` | Cùng structure, 14 sections (dài ~2100 dòng) |
| `src/pages/RoadmapPage.jsx` | Static data page, không có logic phức tạp |
| `src/components/ui/ScrollToTop.jsx` | Simple scroll button |
| `src/components/ui/ThemeToggle.jsx` | Simple toggle button |
| Tất cả `content/` components | Documented đầy đủ ở mục 8 |

---

*Cập nhật lần cuối: 2026-06-03*
*Dự án: JavaDev.wiki — D:\JavaNo1\javadev-wiki*
