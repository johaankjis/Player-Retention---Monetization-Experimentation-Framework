import { cn } from "@/lib/utils"
import type { ExperimentStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: ExperimentStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    draft: "bg-muted text-muted-foreground",
    running: "bg-success/20 text-success",
    paused: "bg-warning/20 text-warning",
    completed: "bg-primary/20 text-primary",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        variants[status],
        className,
      )}
    >
      {status}
    </span>
  )
}
