import type { ModuleStatus } from "@/types/module";
import { cn } from "@/lib/utils";

const statusStyles: Record<ModuleStatus, string> = {
  MVP: "bg-brand-subtle text-brand border-brand/20",
  Core: "bg-emerald-50 text-success border-emerald-200",
  Future: "bg-amber-50 text-warning border-amber-200",
  Planned: "bg-gray-50 text-muted border-border",
};

interface ModuleBadgeProps {
  status: ModuleStatus;
  className?: string;
}

export function ModuleBadge({ status, className }: ModuleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
