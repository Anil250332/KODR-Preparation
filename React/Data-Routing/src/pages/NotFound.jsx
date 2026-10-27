import { Link } from 'react-router'

const NotFound = () => {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-violet-700 px-4 py-2 font-medium text-white hover:bg-violet-800"
      >
        Go home
      </Link>
    </main>
  )
}

export default NotFound
