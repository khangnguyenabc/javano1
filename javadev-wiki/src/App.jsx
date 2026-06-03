import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { router } from './router'
import { ThemeProvider } from './context/ThemeContext'
import { ProgressProvider } from './context/ProgressContext'

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ProgressProvider>
          <RouterProvider router={router} />
        </ProgressProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
