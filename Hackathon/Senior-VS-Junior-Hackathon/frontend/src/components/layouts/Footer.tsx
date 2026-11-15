import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layers, Copy, Check, Heart, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export function Footer() {
  const [copied, setCopied] = useState(false)

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npm run dev')
    setCopied(true)
    toast.success('Copied "npm run dev" to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const footerNavigation = {
    product: [
      { name: 'Dashboard', href: '/' },
      { name: 'Architecture', href: '#architecture' },
      { name: 'UI Components', href: '#components' },
      { name: 'State Management', href: '#features' },
      { name: 'Form Validation', href: '#form-demo' },
    ],
    stack: [
      { name: 'React 19 & Vite 8', href: 'https://vite.dev', external: true },
      { name: 'Tailwind CSS v4', href: 'https://tailwindcss.com', external: true },
      { name: 'Redux Toolkit', href: 'https://redux-toolkit.js.org', external: true },
      { name: 'TanStack Query', href: 'https://tanstack.com/query', external: true },
      { name: 'Zod Validation', href: 'https://zod.dev', external: true },
    ],
    resources: [
      { name: 'shadcn/ui Docs', href: 'https://ui.shadcn.com', external: true },
      { name: 'Lucide Icons', href: 'https://lucide.dev', external: true },
      { name: 'Axios Client', href: 'https://axios-http.com', external: true },
      { name: 'Sonner Toasts', href: 'https://sonner.emilkowal.ski', external: true },
      { name: 'API Health Check', href: '#', onClick: () => window.scrollTo({ top: 350, behavior: 'smooth' }) },
    ],
  }

  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand & Mission Column (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 font-bold text-lg tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm">
                <Layers className="h-4 w-4" />
              </div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                DevStarter
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Hackathon Ready
              </span>
            </Link>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Production-quality starter architecture crafted for college hackathons.
              Build instantly from problem statement to deployable MVP.
            </p>

            {/* Quick CLI command runner */}
            <div className="pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                Quick Dev Command
              </div>
              <div className="inline-flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 w-full max-w-xs shadow-xs">
                <span>$ npm run dev</span>
                <button
                  type="button"
                  onClick={handleCopyCommand}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Copy command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* System Status Indicator */}
            <div className="pt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All starter systems operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerNavigation.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Tech Stack
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerNavigation.stack.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
                  >
                    <span>{item.name}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerNavigation.resources.map((item) => (
                <li key={item.name}>
                  {item.onClick ? (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer text-left"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noreferrer' : undefined}
                      className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
                    >
                      <span>{item.name}</span>
                      {item.external && (
                        <ExternalLink className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 mt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p className="flex items-center gap-1.5">
            <span>&copy; {new Date().getFullYear()} DevStarter &bull; Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for rapid hackathon development.</span>
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              shadcn/ui
            </a>
            <a
              href="#docs"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer

