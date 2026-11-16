export default function WardBarChart({ wards = [] }) {
  if (!wards || wards.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
      {wards.map((ward) => {
        const rate = ward.calculatedResolutionRate ?? ward.resolutionRate ?? 0;
        let barColor = "#16a34a"; // green
        if (rate < 80) barColor = "#d97706"; // amber
        if (rate < 70) barColor = "#dc2626"; // red

        return (
          <div key={ward.id} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "13px"
              }}
            >
              <span style={{ fontWeight: "700", color: "#132a1e" }}>
                {ward.name.split("-")[1]?.trim() || ward.name}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", color: "#4a6356" }}>
                  {ward.resolvedComplaints || ward.resolvedCount || 0} /{" "}
                  {ward.totalComplaints || ward.currentComplaintsCount || 0} resolved
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "800",
                    color: barColor,
                    minWidth: "48px",
                    textAlign: "right"
                  }}
                >
                  {rate}%
                </span>
              </div>
            </div>

            {/* Progress track */}
            <div
              style={{
                width: "100%",
                height: "10px",
                backgroundColor: "#eef2ef",
                borderRadius: "999px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, rate))}%`,
                  height: "100%",
                  backgroundColor: barColor,
                  borderRadius: "999px",
                  transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
