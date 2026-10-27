import { createBrowserRouter, redirect, RouterProvider } from 'react-router'
import About from '../pages/About.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import NotFound from '../pages/NotFound.jsx'
import Product from '../pages/Product.jsx'
import Register from '../pages/Register.jsx'
import AuthLayout from '../layout/AuthLayout.jsx'
import MainLayout from '../layout/MainLayout.jsx'
import { isAuthenticated } from '../auth.js'

const requireAuth = ({ request }) => {
  if (!isAuthenticated()) {
    const requestedUrl = new URL(request.url)
    const returnTo = `${requestedUrl.pathname}${requestedUrl.search}${requestedUrl.hash}`

    throw redirect(`/auth/login?redirectTo=${encodeURIComponent(returnTo)}`)
  }

  return null
}

const router = createBrowserRouter([
  {
    path: '/',
    loader: requireAuth,
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'product', element: <Product /> },
    ],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

const AppRoute = () => <RouterProvider router={router} />

export default AppRoute