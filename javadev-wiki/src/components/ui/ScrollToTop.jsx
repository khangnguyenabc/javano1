import { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="
        fixed bottom-6 right-6 z-40
        w-10 h-10 flex items-center justify-center
        bg-surface border border-border
        text-muted hover:text-primary hover:border-muted
        transition-all duration-150 shadow-sm
        rounded-sm text-base leading-none
      "
      aria-label="Scroll to top"
    >
      ↑
    </button>
  )
}
