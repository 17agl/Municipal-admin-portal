import { useMemo } from "react";
import { useMunicipal } from "../context/MunicipalContext";
import WardBarChart from "../components/charts/WardBarChart";
import CategoryDonutChart from "../components/charts/CategoryDonutChart";
import {
  BarChart3,
  TrendingUp,
  Award,
  Sparkles,
  Shield,
  Zap,
  Download,
  CheckCircle,
  Clock
} from "../components/common/Icons";

export default function ImpactAnalytics() {
  const { metrics, complaints, collections, wards, smartBins } = useMunicipal();

  const totalWasteKg = metrics.totalWasteCollectedKg;
  const totalWasteTons = (totalWasteKg / 1000).toFixed(1);

  // Environmental Impact Conversions
  // 1 ton recycled avoids ~1.4 tons CO2e
  const co2AvoidedTons = (Number(totalWasteTons) * 1.42).toFixed(1);
  // 1 ton organic waste generates ~280 kWh energy or compost
  const energyKWh = Math.round(Number(totalWasteTons) * 285);
  // Trees equivalent saved
  const treesEquivalent = Math.round(Number(totalWasteTons) * 16);

  const categoryChartData = [
    { label: "High-Grade Recyclable Plastics", count: 42, color: "#2563eb" },
    { label: "Organic Bio-Compostable", count: 35, color: "#16a34a" },
    { label: "Corrugated Cardboard & Pulp", count: 18, color: "#d97706" },
    { label: "E-Waste / Hazardous Neutralized", count: 5, color: "#dc2626" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <BarChart3 size={24} color="#1b5e20" />
            <span>Environmental Impact &amp; Municipal Analytics</span>
          </h1>
          <p>
            Quantified ESG metrics, circular economy diversion rates, carbon abatement indices, and ward SLA compliance.
          </p>
        </div>

        <div className="page-actions">
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              background: "#dcfce7",
              color: "#166534",
              padding: "4px 12px",
              borderRadius: "999px",
              border: "1px solid #bbf7d0"
            }}
          >
            CPCB Clean City Benchmark: Grade A+
          </span>
        </div>
      </div>

      {/* Headline Environmental Abatement Banner */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #1b5e20, #0f3d14)",
          color: "#ffffff",
          padding: "28px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px"
        }}
      >
        <div>
          <div style={{ fontSize: "12px", color: "#a7f3d0", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Total Waste Processed
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", marginTop: "4px" }}>
            {totalWasteTons} Tons
          </div>
          <div style={{ fontSize: "12px", color: "#d1fae5", marginTop: "4px" }}>
            Diverted from municipal landfills
          </div>
        </div>

        <div>
          <div style={{ fontSize: "12px", color: "#a7f3d0", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Carbon Emissions Offset
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", marginTop: "4px", color: "#a7f3d0" }}>
            {co2AvoidedTons} MT
          </div>
          <div style={{ fontSize: "12px", color: "#d1fae5", marginTop: "4px" }}>
            Greenhouse gas mitigation
          </div>
        </div>

        <div>
          <div style={{ fontSize: "12px", color: "#a7f3d0", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Clean Energy Generated
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", marginTop: "4px", color: "#fef08a" }}>
            {energyKWh} kWh
          </div>
          <div style={{ fontSize: "12px", color: "#d1fae5", marginTop: "4px" }}>
            Via Bio-methanation &amp; MRF
          </div>
        </div>

        <div>
          <div style={{ fontSize: "12px", color: "#a7f3d0", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Tree Preservation Index
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", marginTop: "4px" }}>
            🌲 {treesEquivalent} Trees
          </div>
          <div style={{ fontSize: "12px", color: "#d1fae5", marginTop: "4px" }}>
            Preserved through cardboard pulp recovery
          </div>
        </div>
      </div>

      {/* 2-Column Analytics Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "24px" }}>
        {/* Ward Performance Ranking Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Shield size={18} color="#1b5e20" />
                <span>Ward Resolution SLA &amp; Cleanliness Ranking</span>
              </div>
              <div className="card-subtitle">
                Ranked by turnaround compliance and citizen satisfaction
              </div>
            </div>
          </div>

          <div className="table-container" style={{ border: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Ward Name</th>
                  <th>Supervisor</th>
                  <th>Resolution Rate</th>
                  <th>Avg Response</th>
                </tr>
              </thead>
              <tbody>
                {metrics.wardPerformance
                  .sort((a, b) => b.calculatedResolutionRate - a.calculatedResolutionRate)
                  .map((w, idx) => (
                    <tr key={w.id}>
                      <td style={{ fontWeight: "800", color: idx === 0 ? "#16a34a" : "#4a6356" }}>
                        #{idx + 1} {idx === 0 && "🏆"}
                      </td>
                      <td style={{ fontWeight: "700" }}>{w.name}</td>
                      <td style={{ fontSize: "12.5px", color: "#5a7567" }}>{w.supervisor}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              fontWeight: "800",
                              color: w.calculatedResolutionRate >= 85 ? "#16a34a" : "#d97706"
                            }}
                          >
                            {w.calculatedResolutionRate}%
                          </span>
                        </div>
                      </td>
                      <td style={{ fontSize: "12px", color: "#4a6356" }}>
                        {w.avgResolutionHours} hrs
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Material Recovery Distribution */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="card-header">
              <div>
                <div className="card-title">
                  <Sparkles size={18} color="#7c3aed" />
                  <span>Segregated Material Recovery Index</span>
                </div>
                <div className="card-subtitle">
                  Tonnage distribution across municipal processing facilities
                </div>
              </div>
            </div>

            <CategoryDonutChart data={categoryChartData} />
          </div>

          {/* Efficiency Footnote */}
          <div
            style={{
              padding: "14px 16px",
              background: "#f4f8f5",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              fontSize: "12.5px",
              color: "#374f42",
              marginTop: "16px"
            }}
          >
            <strong>Circular Economy Audit:</strong> Over 92% of collected plastics were routed directly to registered pyrolysis and polymer pelletizers, avoiding unauthorized roadside burning.
          </div>
        </div>
      </div>
    </div>
  );
}
