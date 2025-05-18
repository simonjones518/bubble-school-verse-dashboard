
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
};

export function StatCard({
  icon: Icon,
  title,
  value,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm text-bubble-neutral">{title}</h3>
        <div className="p-2 rounded-full bg-bubble-light/50">
          <Icon size={18} className="text-bubble-primary" />
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      {description && (
        <p className="text-xs text-bubble-neutral">{description}</p>
      )}
      {trend && (
        <div
          className={cn(
            "flex items-center text-xs space-x-1",
            trend.isPositive ? "text-green-500" : "text-red-500"
          )}
        >
          <span
            className={cn(
              "inline-block w-0 h-0 border-x-4 border-x-transparent",
              trend.isPositive
                ? "border-b-4 border-b-green-500"
                : "border-t-4 border-t-red-500"
            )}
          />
          <span>{trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%</span>
          <span className="text-bubble-neutral">from last month</span>
        </div>
      )}
    </div>
  );
}
