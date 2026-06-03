import { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'javadev-progress'

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function save(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage quota exceeded or unavailable — silently skip
  }
}

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress)

  function markDone(categorySlug, subTopic) {
    setProgress((prev) => {
      const next = {
        ...prev,
        [categorySlug]: [...new Set([...(prev[categorySlug] ?? []), subTopic])],
      }
      save(next)
      return next
    })
  }

  function markUndone(categorySlug, subTopic) {
    setProgress((prev) => {
      const next = {
        ...prev,
        [categorySlug]: (prev[categorySlug] ?? []).filter((t) => t !== subTopic),
      }
      save(next)
      return next
    })
  }

  function getProgressForCategory(categorySlug) {
    return progress[categorySlug] ?? []
  }

  return (
    <ProgressContext.Provider value={{ progress, markDone, markUndone, getProgressForCategory }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within <ProgressProvider>')
  return ctx
}
