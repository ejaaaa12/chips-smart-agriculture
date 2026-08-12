import { LucideIcon, ArrowUp } from "lucide-react";

export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
  trend,
  action,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  sub: string;
  trend?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card p-5 flex flex-col gap-3 min-w-0">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-md"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={15} style={{ color: iconColor }} />
        </span>
        <span className="text-sm font-medium" style={{ color: iconColor }}>
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-ink-900">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-900/50">{sub}</p>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-medium text-brand-600">
            <ArrowUp size={12} />
            {trend}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}
