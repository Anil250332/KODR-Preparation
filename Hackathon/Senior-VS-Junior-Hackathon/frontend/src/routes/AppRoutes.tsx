import React, { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { PageLoader } from '@/components/common/PageLoader'

// Route-level code splitting using React.lazy()
const HomePage = lazy(() => import('@/features/home/HomePage'))
const NotFound = lazy(() => import('@/routes/NotFound'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<PageLoader message="Loading dashboard..." />}>
            <HomePage />
          </React.Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <React.Suspense fallback={<PageLoader message="Loading..." />}>
            <NotFound />
          </React.Suspense>
        ),
      },
    ],
  },
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}
export default AppRoutes

