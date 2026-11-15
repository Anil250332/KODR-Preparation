import { Loader2 } from 'lucide-react'

export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      <p className="text-sm text-zinc-500 font-medium">{message}</p>
    </div>
  )
}

