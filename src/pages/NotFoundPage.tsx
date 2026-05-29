import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">404 – Seite nicht gefunden</h1>
      <p className="text-gray-600 mt-2">Diese Seite existiert nicht.</p>
      <Link to="/book" className="mt-4 inline-block text-blue-600 underline">
        Zur Buchungsseite
      </Link>
    </div>
  )
}
