import { Link, Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <main className="mx-auto min-h-screen max-w-lg px-6 py-10">
      <Link to="/" className="text-sm text-violet-700 hover:underline">
        Back to home
      </Link>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Outlet />
      </section>
    </main>
  )
}

export default AuthLayout