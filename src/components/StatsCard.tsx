"use client";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}: StatsCardProps) {
  return (
    <div className="bg-surface border border-border p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden group hover:border-primary/30 transition-all">
      <div className="flex items-center justify-between z-10">
        <span className="text-foreground-muted text-sm font-medium">
          {title}
        </span>
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <div className="z-10">
        <h3 className="text-2xl font-bold font-display text-white">{value}</h3>
        {trend && (
          <p
            className={`text-xs mt-1 flex items-center gap-1 ${trendUp ? "text-green-400" : "text-red-400"}`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {trendUp ? "trending_up" : "trending_down"}
            </span>
            {trend}
          </p>
        )}
      </div>

      {/* Background Decoration */}
      <div className="absolute -bottom-4 -right-4 text-primary/5 group-hover:text-primary/10 transition-colors z-0">
        <span className="material-symbols-outlined text-[100px]">{icon}</span>
      </div>
    </div>
  );
}
