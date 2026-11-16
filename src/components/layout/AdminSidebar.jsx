import { NavLink } from "react-router-dom";
import { useMunicipal } from "../../context/MunicipalContext";
import {
  LayoutDashboard,
  FileText,
  Map,
  Users,
  CheckSquare,
  Truck,
  Route,
  Trash2,
  BarChart3,
  Download,
  Settings,
  Shield,
  AlertTriangle
} from "../common/Icons";

export default function AdminSidebar({ isOpen, onClose }) {
  const { metrics } = useMunicipal();

  const navItems = [
    {
      to: "/",
      label: "Command Center",
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: "/complaints",
      label: "Complaint Management",
      icon: FileText,
      badge: metrics.pendingComplaints > 0 ? metrics.pendingComplaints : null,
      badgeColor: "#ea580c"
    },
    {
      to: "/map",
      label: "Live Garbage Map",
      icon: Map,
      badge: "LIVE",
      badgeColor: "#16a34a"
    },
    {
      to: "/staff",
      label: "Staff Management",
      icon: Users,
      badge: `${metrics.activeStaffMembers} Active`
    },
    {
      to: "/tasks",
      label: "Task Assignment",
      icon: CheckSquare,
      badge: metrics.overdueComplaints > 0 ? `${metrics.overdueComplaints} Overdue` : null,
      badgeColor: "#dc2626"
    },
    {
      to: "/collections",
      label: "Collection Management",
      icon: Truck,
      badge: null
    },
    {
      to: "/routes",
      label: "Route Management",
      icon: Route,
      badge: null
    },
    {
      to: "/smart-bins",
      label: "Smart Bin Monitoring",
      icon: Trash2,
      badge: metrics.overflowingBinsCount > 0 ? `${metrics.overflowingBinsCount} Alerts` : null,
      badgeColor: "#dc2626"
    },
    {
      to: "/analytics",
      label: "Impact Analytics",
      icon: BarChart3,
      badge: null
    },
    {
      to: "/reports",
      label: "Reports & Audits",
      icon: Download,
      badge: null
    },
    {
      to: "/settings",
      label: "Settings",
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside
      className={`admin-sidebar ${isOpen ? "open" : ""}`}
      style={{
        width: "var(--sidebar-width)",
        backgroundColor: "#ffffff",
        borderRight: "1px solid var(--border-subtle)",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto"
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "20px 20px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #1b5e20, #2e7d32)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            boxShadow: "0 4px 10px rgba(27, 94, 32, 0.25)"
          }}
        >
          <Shield size={22} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "17px",
                fontWeight: "800",
                color: "#132a1e",
                letterSpacing: "-0.02em"
              }}
            >
              EcoSort<span style={{ color: "#2e7d32" }}>AI</span>
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                background: "#e8f5e9",
                color: "#1b5e20",
                padding: "2px 6px",
                borderRadius: "6px",
                border: "1px solid #c8e6c9"
              }}
            >
              GOV
            </span>
          </div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "#6b8075",
              letterSpacing: "0.02em",
              textTransform: "uppercase"
            }}
          >
            Municipal Command
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: "#8fa599",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "8px 12px 4px"
          }}
        >
          Operations & Control
        </div>

        {navItems.map((item) => {
          const IconComp = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: isActive ? "700" : "500",
                color: isActive ? "#1b5e20" : "#374f42",
                backgroundColor: isActive ? "#e8f5e9" : "transparent",
                transition: "all 0.15s ease",
                textDecoration: "none"
              })}
            >
              {({ isActive }) => (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <IconComp
                      size={17}
                      color={isActive ? "#1b5e20" : "#5a7567"}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: "700",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        backgroundColor: item.badgeColor ? `${item.badgeColor}18` : "#f0f4f1",
                        color: item.badgeColor || "#425a4d",
                        border: item.badgeColor ? `1px solid ${item.badgeColor}40` : "1px solid #d5e0d8"
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid var(--border-subtle)",
          background: "#fafcfa"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "#6b8075",
            marginBottom: "6px"
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#16a34a",
                boxShadow: "0 0 0 2px #bbf7d0"
              }}
            />
            Telematics Online
          </span>
          <span style={{ fontWeight: "700" }}>v2.4.0</span>
        </div>
        <div style={{ fontSize: "11px", color: "#8fa599" }}>
          Synced with Citizen Portal & IoT
        </div>
      </div>
    </aside>
  );
}
