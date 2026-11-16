import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMunicipal } from "../context/MunicipalContext";
import StatCard from "../components/common/StatCard";
import WardBarChart from "../components/charts/WardBarChart";
import CategoryDonutChart from "../components/charts/CategoryDonutChart";
import LiveGarbageMap from "../components/map/LiveGarbageMap";
import { StatusBadge, PriorityBadge } from "../components/common/Badge";
import { generateDailyReport } from "../services/reportGenerator";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  Download,
  MapPin,
  ArrowUpRight,
  Shield,
  Trash2,
  Truck,
  Sparkles
} from "../components/common/Icons";

export default function CommandCenter() {
  const navigate = useNavigate();
  const {
    metrics,
    complaints,
    filteredComplaints,
    wards,
    smartBins,
    collections
  } = useMunicipal();

  // Urgent pending complaints needing immediate dispatch
  const urgentComplaints = complaints
    .filter((c) => c.status === "Pending" || c.status === "Overdue" || c.priority === "P1 - Immediate")
    .slice(0, 5);

  // AI Category Distribution data for Donut Chart
  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.aiCategory] = (acc[c.aiCategory] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = [
    { label: "Plastic & Packaging", count: categoryCounts["Plastic & Mixed Packaging"] || 4, color: "#2563eb" },
    { label: "Construction & E-Waste", count: (categoryCounts["Construction & E-Waste Scrap"] || 0) + (categoryCounts["Chemical Drums & Industrial Sludge"] || 2), color: "#dc2626" },
    { label: "Organic & Kitchen", count: (categoryCounts["Organic & Food Waste"] || 0) + (categoryCounts["Religious Offering & Floral Waste"] || 2), color: "#16a34a" },
    { label: "Cardboard & Paper", count: categoryCounts["Cardboard & Packaging Boxes"] || 2, color: "#d97706" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <span>Admin Command Center</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                background: "#e8f5e9",
                color: "#1b5e20",
                padding: "3px 10px",
                borderRadius: "999px",
                border: "1px solid #c8e6c9"
              }}
            >
              REAL-TIME OPS
            </span>
          </h1>
          <p>
            Centralized monitoring for municipal waste complaints, active rapid response squads, and ward resolution SLAs.
          </p>
        </div>

        <div className="page-actions">
          <button
            onClick={() => generateDailyReport(complaints, collections, smartBins, wards)}
            className="btn btn-secondary"
          >
            <Download size={16} />
            <span>Daily Audit Export</span>
          </button>
          <button
            onClick={() => navigate("/tasks")}
            className="btn btn-primary"
          >
            <Truck size={16} />
            <span>Dispatch Squads</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          TOP 8 ADMIN KPI CARDS
          - Total complaints
          - Pending complaints
          - In-progress complaints
          - Resolved complaints
          - Overdue complaints
          - Active staff members
          - Average resolution time
          - Ward-wise performance overview
          ============================================================ */}
      <div className="stats-grid">
        <StatCard
          label="Total Complaints"
          value={metrics.totalComplaints}
          subtext="From citizen portal & AI scanner"
          icon={FileText}
          accentColor="#2e7d32"
          iconBg="#e8f5e9"
          trend="up"
          trendText="+14% this week"
        />

        <StatCard
          label="Pending Complaints"
          value={metrics.pendingComplaints}
          subtext="Awaiting team assignment"
          icon={Clock}
          accentColor="#ea580c"
          iconBg="#ffedd5"
          trend="neutral"
          trendText="Action Required"
        />

        <StatCard
          label="In-Progress"
          value={metrics.inProgressComplaints}
          subtext="Trucks en route / on site"
          icon={Truck}
          accentColor="#2563eb"
          iconBg="#eff6ff"
          trend="neutral"
          trendText="Under Dispatch"
        />

        <StatCard
          label="Resolved Complaints"
          value={metrics.resolvedComplaints}
          subtext="Verified with geotag photo"
          icon={CheckCircle}
          accentColor="#16a34a"
          iconBg="#f0fdf4"
          trend="up"
          trendText="88% Target SLA"
        />

        <StatCard
          label="Overdue Complaints"
          value={metrics.overdueComplaints}
          subtext="Breached SLA response window"
          icon={AlertTriangle}
          accentColor="#dc2626"
          iconBg="#fee2e2"
          trend="down"
          trendText="Urgent Escalation"
        />

        <StatCard
          label="Active Staff Members"
          value={`${metrics.activeStaffMembers} / ${metrics.totalStaffMembers}`}
          subtext="Drivers, supervisors & sweepers"
          icon={Users}
          accentColor="#7c3aed"
          iconBg="#f5f3ff"
          trend="up"
          trendText="100% Shift Coverage"
        />

        <StatCard
          label="Avg Resolution Time"
          value={`${metrics.avgResolutionTimeHours} hrs`}
          subtext="Target benchmark: < 4.0 hrs"
          icon={Clock}
          accentColor="#0891b2"
          iconBg="#ecfeff"
          trend="up"
          trendText="-25 mins faster"
        />

        <StatCard
          label="Today's Waste Cleared"
          value={`${(metrics.totalWasteCollectedKg / 1000).toFixed(1)} T`}
          subtext="Transported to MRF & Composters"
          icon={Trash2}
          accentColor="#15803d"
          iconBg="#dcfce7"
          trend="up"
          trendText="Net Tonnage"
        />
      </div>

      {/* ============================================================
          MAIN COMMAND CENTER GRID:
          Left: Live Garbage Map Overview + Urgent Action Hub
          Right: Ward-Wise Performance + AI Category Breakdown
          ============================================================ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "24px" }}>
        {/* Live Garbage Map View */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="card-header">
            <div>
              <div className="card-title">
                <MapPin size={18} color="#1b5e20" />
                <span>Live Municipal GIS &amp; Garbage Map</span>
              </div>
              <div className="card-subtitle">
                Interactive real-time visualization of complaint pins, hotspots, smart bins &amp; trucks
              </div>
            </div>
            <Link to="/map" className="btn btn-secondary btn-sm">
              <span>Full Screen Map</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <LiveGarbageMap height="380px" />
        </div>

        {/* Ward-wise Performance Widget */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div className="card-header">
            <div>
              <div className="card-title">
                <Shield size={18} color="#1b5e20" />
                <span>Ward-Wise Performance &amp; SLA Compliance</span>
              </div>
              <div className="card-subtitle">
                Resolution rates by municipal ward supervisor and sanitation zone
              </div>
            </div>
            <Link to="/reports" className="btn btn-secondary btn-sm">
              <span>Audit Details</span>
            </Link>
          </div>

          <WardBarChart wards={metrics.wardPerformance} />

          {/* Ward Summary Pills */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "10px",
              marginTop: "8px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border-subtle)"
            }}
          >
            {metrics.wardPerformance.slice(0, 3).map((w) => (
              <div
                key={w.id}
                style={{
                  background: "#f9fcf9",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ fontSize: "11px", color: "#6b8075", fontWeight: "600" }}>{w.code}</div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "#132a1e" }}>{w.supervisor.split(" ")[0]}</div>
                <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: "700" }}>
                  {w.calculatedResolutionRate}% SLA
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          SECOND ROW:
          Left: Urgent Complaints Requiring Immediate Action
          Right: AI Categorization & Waste Statistics
          ============================================================ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "24px" }}>
        {/* Urgent Action Hub */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <AlertTriangle size={18} color="#dc2626" />
                <span>High Priority &amp; Overdue Complaints</span>
              </div>
              <div className="card-subtitle">
                Tickets requiring dispatcher action or field crew re-assignment
              </div>
            </div>
            <Link to="/complaints" className="btn btn-secondary btn-sm">
              <span>View All ({complaints.length})</span>
            </Link>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Location / Ward</th>
                  <th>AI Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {urgentComplaints.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: "700", color: "#1b5e20" }}>{c.id}</div>
                      <div style={{ fontSize: "11px", color: "#7b9487" }}>{c.reportsCount} reports</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: "600" }}>{c.areaName}</div>
                      <div style={{ fontSize: "11.5px", color: "#5a7567" }}>{c.ward}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", color: "#374f42" }}>{c.aiCategory}</span>
                    </td>
                    <td>
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td>
                      <Link
                        to={`/complaints/${c.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "4px 8px" }}
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Category Distribution & Environmental Impact Overview */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="card-header">
              <div>
                <div className="card-title">
                  <Sparkles size={18} color="#7c3aed" />
                  <span>AI Waste Classification Distribution</span>
                </div>
                <div className="card-subtitle">
                  Computer vision waste recognition breakdown from citizen uploads
                </div>
              </div>
              <Link to="/analytics" className="btn btn-secondary btn-sm">
                <span>Detailed Impact</span>
              </Link>
            </div>

            <CategoryDonutChart data={categoryChartData} />
          </div>

          {/* Bottom Eco Impact Mini Banner */}
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "linear-gradient(135deg, #e8f5e9, #f1f8f3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid #c8e6c9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: "800", color: "#1b5e20" }}>
                🌱 Landfill Diversion Rate: 76.4%
              </div>
              <div style={{ fontSize: "12px", color: "#3e654e" }}>
                14.2 Tons composted or recycled today across all 5 municipal wards.
              </div>
            </div>
            <Link to="/smart-bins" className="btn btn-primary btn-sm">
              <span>View Smart Bins</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
