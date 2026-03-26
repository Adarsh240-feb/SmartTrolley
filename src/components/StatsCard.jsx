export default function StatsCard({ title, value, icon: Icon, color = "primary" }) {
  const colors = {
    primary: "text-primary-600 bg-primary-50",
    success: "text-emerald-600 bg-emerald-50",
    warning: "text-amber-600 bg-amber-50",
    accent: "text-violet-600 bg-violet-50",
  };

  const c = colors[color] || colors.primary;
  const [textColor, bgColor] = c.split(" ");

  return (
    <div className="rounded-xl border border-border bg-white p-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-text-muted mb-1">{title}</p>
          <p className="text-xl font-bold text-text-primary">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-lg ${bgColor} flex items-center justify-center`}>
          {Icon && <Icon className={`w-4 h-4 ${textColor}`} />}
        </div>
      </div>
    </div>
  );
}
