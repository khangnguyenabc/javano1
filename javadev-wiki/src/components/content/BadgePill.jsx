const colorMap = {
  'Core concept':        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'Production':          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Pattern':             'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Redis 5+':            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Redis 6+':            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Redis 7+':            'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'Reference':           'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  'Redis Stack':         'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'GoF Patterns':        'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Architecture':        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Enterprise Patterns': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'DDD':                 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Advanced':            'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
}

const fallback = 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'

/** @param {{ badge: string }} props */
export function BadgePill({ badge }) {
  const colorClass = colorMap[badge] ?? fallback
  return (
    <span className={`font-sans text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClass}`}>
      {badge}
    </span>
  )
}
