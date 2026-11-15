import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error = false, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 transition-all disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900 dark:text-zinc-100',
          error
            ? 'border-rose-500 focus-visible:ring-rose-500'
            : 'border-zinc-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/20 dark:border-zinc-700 dark:focus-visible:ring-indigo-500/30',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

