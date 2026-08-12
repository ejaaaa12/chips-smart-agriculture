import { Calendar } from "lucide-react";

export default function Topbar({
  emoji,
  icon,
  title,
  subtitle,
  description,
  dateLabel,
  rightSlot,
}: {
  emoji?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  dateLabel: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div className="flex items-start gap-3">
        {icon}
        {emoji && <span className="text-2xl mt-0.5">{emoji}</span>}
        <div>
          <h1 className="text-xl font-bold text-ink-900">{title}</h1>
          {subtitle && <p className="text-sm text-ink-900/70 mt-0.5">{subtitle}</p>}
          {description && <p className="text-sm text-ink-900/50">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink-900/70">
          <Calendar size={16} />
          {dateLabel}
        </div>
        {rightSlot}
      </div>
    </div>
  );
}