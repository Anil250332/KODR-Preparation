import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={`Theme: ${theme}`}
      className={cn(
        'group relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 backdrop-blur-xs transition-all duration-200 hover:scale-105 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70 hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-95 cursor-pointer',
        className
      )}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 ease-out dark:-rotate-90 dark:scale-0 text-amber-500 group-hover:rotate-45" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 ease-out dark:rotate-0 dark:scale-100 text-indigo-400 group-hover:-rotate-12" />
    </button>
  )
}
