export function StatusBadge({ status }) {
  let badgeClass = "badge-pending";
  let dotColor = "#ea580c";

  if (status === "In-Progress") {
    badgeClass = "badge-in-progress";
    dotColor = "#2563eb";
  } else if (status === "Resolved") {
    badgeClass = "badge-resolved";
    dotColor = "#16a34a";
  } else if (status === "Overdue") {
    badgeClass = "badge-overdue";
    dotColor = "#dc2626";
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: dotColor
        }}
      />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  let badgeClass = "badge-p3";
  if (priority?.startsWith("P1")) badgeClass = "badge-p1";
  else if (priority?.startsWith("P2")) badgeClass = "badge-p2";
  else if (priority?.startsWith("P4")) badgeClass = "badge-p4";

  return <span className={`badge ${badgeClass}`}>{priority}</span>;
}

export function SeverityBadge({ severity }) {
  let bg = "#f0f4f1";
  let color = "#374f42";

  if (severity === "Critical") {
    bg = "#fee2e2";
    color = "#991b1b";
  } else if (severity === "High") {
    bg = "#ffedd5";
    color = "#9a3412";
  } else if (severity === "Medium") {
    bg = "#fef9c3";
    color = "#854d0e";
  } else if (severity === "Low") {
    bg = "#dcfce7";
    color = "#166534";
  }

  return (
    <span
      className="badge"
      style={{
        backgroundColor: bg,
        color: color,
        border: `1px solid ${color}33`
      }}
    >
      {severity}
    </span>
  );
}
