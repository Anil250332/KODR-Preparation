import { Suspense, useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layers, Menu, X, ArrowRight } from 'lucide-react'
import { PageLoader } from '@/components/common/PageLoader'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Footer } from '@/components/layouts/Footer'
import { cn } from '@/lib/utils'

function GithubIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function RootLayout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Track window scroll to trigger subtle floating island
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Components', href: '#components' },
    { name: 'Docs', href: '#docs' },
  ]

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    if (href.startsWith('#')) {
      const el = document.getElementById(href.replace('#', ''))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 antialiased font-sans transition-colors duration-200">
      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-50 w-full transition-all duration-300 pointer-events-none px-3 sm:px-6">
        <div
          className={cn(
            'pointer-events-auto mx-auto flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            isScrolled
              ? 'mt-3 max-w-5xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-md shadow-zinc-950/5 dark:shadow-black/20 py-2.5 px-4 sm:px-6'
              : 'mt-0 max-w-7xl rounded-none border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md py-3.5 px-4 sm:px-8'
          )}
        >
          {/* Logo & Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 font-bold text-base tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Layers className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                DevStarter
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
                v1.0
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith('#')) {
                      e.preventDefault()
                      handleNavClick(link.href)
                    }
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    isActive
                      ? 'text-zinc-900 dark:text-zinc-100 font-semibold bg-zinc-100 dark:bg-zinc-800/60'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40'
                  )}
                >
                  {link.name}
                </a>
              )
            })}
          </nav>

          {/* Right Actions: Github, Theme, Sign in, CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* GitHub Link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="View on GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {/* Divider */}
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

            {/* Clean Sign In Link */}
            <button
              onClick={() => {
                const el = document.getElementById('login-modal')
                if (!el) {
                  window.scrollTo({ top: 300, behavior: 'smooth' })
                }
              }}
              className="px-2.5 py-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Sign In
            </button>

            {/* Professional Primary Button */}
            <button
              onClick={() => {
                const formSection = document.getElementById('form-demo')
                if (formSection) {
                  formSection.scrollIntoView({ behavior: 'smooth' })
                } else {
                  window.scrollTo({ top: 400, behavior: 'smooth' })
                }
              }}
              className="group inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-medium shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile hamburger & theme toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto md:hidden mt-2 max-w-lg mx-auto rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-4 shadow-xl space-y-2 animate-in fade-in-50 slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault()
                    handleNavClick(link.href)
                  } else {
                    setMobileMenuOpen(false)
                  }
                }}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              >
                Sign In
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium text-center"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Production Footer */}
      <Footer />

      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
    </div>
  )
}
export default RootLayout
