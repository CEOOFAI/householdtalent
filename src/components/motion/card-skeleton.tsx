import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Grid of card-shaped loading placeholders (e.g. in a route's loading.tsx).
 *
 *   <CardSkeleton count={6} className="md:grid-cols-3" />
 */
export function CardSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      <span className="sr-only">Loading…</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="mt-5 h-9 w-full" />
        </div>
      ))}
    </div>
  )
}
