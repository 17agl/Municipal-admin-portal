import { useState, useEffect } from "react";
import { useMunicipal } from "../../context/MunicipalContext";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Bell,
  RefreshCw,
  Shield,
  AlertTriangle,
  Trash2,
  Clock,
  CheckCircle,
  X
} from "../common/Icons";

export default function AdminHeader({ onToggleSidebar }) {
  const {
    wards,
    selectedWardFilter,
    setSelectedWardFilter,
    globalSearchQuery,
    setGlobalSearchQuery,
    complaints,
    smartBins,
    metrics
  } = useMunicipal();

  const { adminUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // System alerts: Overdue complaints + overflowing bins
  const overdueAlerts = complaints.filter((c) => c.status === "Overdue");
  const binAlerts = smartBins.filter((b) => b.fillLevel >= 85);
  const totalAlertCount = overdueAlerts.length + binAlerts.length;

  return (
    <header
      style={{
        height: "var(--header-height)",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
      }}
    >
      {/* Left: Mobile Toggle & Ward Filter */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={onToggleSidebar}
          className="btn-icon"
          style={{
            display: "none",
            backgroundColor: "#f4f7f5",
            border: "1px solid var(--border-strong)"
          }}
          aria-label="Toggle Navigation"
        >
          <span style={{ fontSize: "18px" }}>☰</span>
        </button>

        {/* Ward Selector Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.04em"
            }}
          >
            Jurisdiction:
          </span>
          <select
            value={selectedWardFilter}
            onChange={(e) => setSelectedWardFilter(e.target.value)}
            className="form-control form-select"
            style={{
              width: "auto",
              minWidth: "200px",
              padding: "7px 32px 7px 12px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#1b5e20",
              borderColor: "#c8e6c9",
              backgroundColor: "#f9fcf9"
            }}
          >
            <option value="ALL">🏙️ All Municipal Wards (City-wide)</option>
            {wards.map((w) => (
              <option key={w.id} value={w.name}>
                📍 {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Global Search */}
        <div
          style={{
            position: "relative",
            width: "300px"
          }}
        >
          <Search
            size={16}
            color="#7b9487"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="Search complaint, area, staff..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="form-control"
            style={{
              paddingLeft: "36px",
              paddingTop: "7px",
              paddingBottom: "7px",
              fontSize: "12.5px",
              backgroundColor: "#f8faf8"
            }}
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9aa8a0"
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Clock, Notifications & User */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        {/* Real-time Clock Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--text-secondary)",
            background: "#f4f7f5",
            padding: "5px 12px",
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--border-subtle)",
            fontFamily: "var(--font-mono)"
          }}
        >
          <Clock size={13} color="#2e7d32" />
          <span>{currentTime}</span>
        </div>

        {/* Notifications Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon"
            style={{
              position: "relative",
              backgroundColor: showNotifications ? "#e8f5e9" : "#f4f7f5",
              border: "1px solid var(--border-subtle)"
            }}
            title="System Alerts & Warnings"
          >
            <Bell size={18} color="#1b5e20" />
            {totalAlertCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "#dc2626",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: "800",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 5px rgba(220,38,38,0.4)"
                }}
              >
                {totalAlertCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: "360px",
                backgroundColor: "#ffffff",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--border-subtle)",
                zIndex: 100,
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--border-subtle)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#f8faf8"
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#132a1e" }}>
                  Operational Alerts ({totalAlertCount})
                </span>
                <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: "700" }}>
                  Action Required
                </span>
              </div>

              <div style={{ maxHeight: "300px", overflowY: "auto", padding: "8px 0" }}>
                {overdueAlerts.length === 0 && binAlerts.length === 0 ? (
                  <div style={{ padding: "24px", textAlign: "center", color: "#7b9487", fontSize: "13px" }}>
                    <CheckCircle size={24} color="#16a34a" style={{ margin: "0 auto 8px" }} />
                    All complaints on track & bins operating normally.
                  </div>
                ) : (
                  <>
                    {overdueAlerts.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          padding: "10px 16px",
                          borderBottom: "1px solid #f0f4f1",
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                          background: "#fff9f9"
                        }}
                      >
                        <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: "700", color: "#991b1b" }}>
                            SLA Overdue: {c.id}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#4a6356" }}>
                            {c.areaName} ({c.ward})
                          </div>
                          <div style={{ fontSize: "10.5px", color: "#b91c1c", marginTop: "2px" }}>
                            Priority: {c.priority} • Reports: {c.reportsCount}
                          </div>
                        </div>
                      </div>
                    ))}

                    {binAlerts.map((b) => (
                      <div
                        key={b.id}
                        style={{
                          padding: "10px 16px",
                          borderBottom: "1px solid #f0f4f1",
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                          background: "#fffaf0"
                        }}
                      >
                        <Trash2 size={16} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: "700", color: "#b45309" }}>
                            Smart Bin {b.fillLevel}% Full: {b.code}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#4a6356" }}>
                            {b.location} ({b.ward})
                          </div>
                          <div style={{ fontSize: "10.5px", color: "#78350f", marginTop: "2px" }}>
                            Category: {b.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "4px 8px 4px 4px",
            borderRadius: "var(--radius-pill)",
            backgroundColor: "#f4f7f5",
            border: "1px solid var(--border-subtle)"
          }}
        >
          <img
            src={adminUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80"}
            alt={adminUser?.name || "Admin"}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #ffffff"
            }}
          />
          <div style={{ paddingRight: "6px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#132a1e", lineHeight: 1.2 }}>
              {adminUser?.name?.split(",")[0] || "Municipal Admin"}
            </div>
            <div style={{ fontSize: "10.5px", color: "#2e7d32", fontWeight: "600" }}>
              Commissioner Desk
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
