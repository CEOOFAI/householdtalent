import { cn } from "@/lib/utils"

/**
 * Loading placeholder with a subtle shimmer sweep (static under reduced motion).
 *   <Skeleton className="h-4 w-32" />
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-shimmer rounded-md bg-white/[0.06]", className)}
      {...props}
    />
  )
}

export { Skeleton }
