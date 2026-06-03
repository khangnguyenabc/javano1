import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="py-24 flex flex-col items-start">
      <p className="font-mono font-bold text-6xl text-accent mb-6 leading-none">404</p>
      <h1 className="font-serif font-bold text-3xl text-primary mb-4">Page not found</h1>
      <p className="text-muted font-sans mb-8 max-w-prose">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="font-sans text-sm text-info hover:underline underline-offset-4 transition-colors"
      >
        ← Return to home
      </Link>
    </div>
  )
}
