import { TrendingUp, TrendingDown } from "./Icons";

export default function StatCard({
  label,
  value,
  subtext,
  icon: IconComponent,
  accentColor = "#1b5e20",
  iconBg = "#e8f5e9",
  trend,
  trendText
}) {
  return (
    <div
      className="stat-card"
      style={{
        "--accent-color": accentColor,
        "--icon-bg": iconBg
      }}
    >
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        {IconComponent && (
          <div className="stat-icon-wrapper">
            <IconComponent size={18} />
          </div>
        )}
      </div>

      <div className="stat-value">{value}</div>

      {(subtext || trendText) && (
        <div className="stat-subtext">
          {trend === "up" && <TrendingUp size={14} color="#16a34a" />}
          {trend === "down" && <TrendingDown size={14} color="#dc2626" />}
          {trendText && (
            <span
              style={{
                fontWeight: "700",
                color: trend === "up" ? "#16a34a" : trend === "down" ? "#dc2626" : "inherit"
              }}
            >
              {trendText}
            </span>
          )}
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
}
