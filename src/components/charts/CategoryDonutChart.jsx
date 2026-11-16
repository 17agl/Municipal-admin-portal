export default function CategoryDonutChart({ data = [] }) {
  // data: [{ label, count, color }]
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;

  let cumulativeAngle = 0;
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        flexWrap: "wrap",
        padding: "10px 0"
      }}
    >
      {/* SVG Donut */}
      <div style={{ position: "relative", width: "160px", height: "160px", flexShrink: 0 }}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#f0f4f1"
            strokeWidth={strokeWidth}
          />
          {data.map((item, idx) => {
            const percentage = item.count / total;
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeAngle * circumference;
            cumulativeAngle += percentage;

            return (
              <circle
                key={idx}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={item.color || "#2e7d32"}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dasharray 0.5s ease" }}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: "800", color: "#132a1e" }}>
            {total}
          </span>
          <span style={{ fontSize: "11px", color: "#7b9487", textTransform: "uppercase", fontWeight: "600" }}>
            Total Cases
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: "160px" }}>
        {data.map((item, idx) => {
          const pct = Math.round((item.count / total) * 100);
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12.5px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "3px",
                    backgroundColor: item.color
                  }}
                />
                <span style={{ color: "#374f42", fontWeight: "600" }}>{item.label}</span>
              </div>
              <span style={{ fontWeight: "700", color: "#132a1e" }}>
                {item.count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
