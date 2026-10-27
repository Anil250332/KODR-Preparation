import { NavLink, Outlet, useNavigate } from 'react-router'
import { logOut } from '../auth.js'

const MainLayout = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    logOut()
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
          <NavLink to="/" end className="font-semibold">
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/product">Product</NavLink>
          <span className="flex-1" />
          <NavLink to="/auth/login">Login</NavLink>
          <NavLink to="/auth/register">Register</NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="text-slate-600 hover:text-violet-700"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout