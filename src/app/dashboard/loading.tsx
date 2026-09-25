import { Skeleton } from '@/components/ui/skeleton'
import { CardSkeleton } from '@/components/motion/card-skeleton'

// Shown instantly while a dashboard page loads its data.
export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <CardSkeleton count={6} />
    </div>
  )
}
