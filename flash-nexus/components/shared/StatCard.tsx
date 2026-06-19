import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-5 shadow-sm",
        className,
      )}
    >
      <p className="text-sm font-medium text-muted">{title}</p>
      <p className="font-tabular mt-2 text-2xl font-bold text-foreground">
        {value}
      </p>
      {description && (
        <p className="mt-1 text-xs text-muted">{description}</p>
      )}
      {trend && (
        <p className="mt-2 text-xs font-medium text-success">{trend}</p>
      )}
    </div>
  );
}

interface SectionCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-6 shadow-sm",
        className,
      )}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
