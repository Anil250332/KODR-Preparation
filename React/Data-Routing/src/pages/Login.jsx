import { useNavigate, useSearchParams } from 'react-router'
import { logIn } from '../auth.js'

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = (event) => {
    event.preventDefault()
    logIn()

    const returnTo = searchParams.get('redirectTo')
    const destination =
      returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/'

    navigate(destination, { replace: true })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-2 text-sm text-slate-600">
        Demo login only; this does not authenticate against a server.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-violet-700 px-4 py-2 font-medium text-white hover:bg-violet-800"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default Login