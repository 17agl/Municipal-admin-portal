import { useState, useMemo } from "react";
import { useMunicipal } from "../context/MunicipalContext";
import Modal from "../components/common/Modal";
import {
  Trash2,
  AlertTriangle,
  Battery,
  Zap,
  Search,
  Plus,
  CheckCircle,
  MapPin,
  RefreshCw
} from "../components/common/Icons";

export default function SmartBinMonitoring() {
  const { smartBins, wards, emptyBin, updateBin } = useMunicipal();

  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // New Smart Bin Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [binLocation, setBinLocation] = useState("");
  const [binWard, setBinWard] = useState(wards[0]?.name || "Ward 1 - Central Market & Bazaar");
  const [binCategory, setBinCategory] = useState("Dry Recyclable Waste");
  const [capacityLiters, setCapacityLiters] = useState("1100");

  const overflowBins = useMemo(
    () => smartBins.filter((b) => b.fillLevel >= 85 || b.status.includes("Overflow")),
    [smartBins]
  );

  const filteredBins = useMemo(() => {
    return smartBins.filter((b) => {
      const matchSearch =
        !search.trim() ||
        b.code.toLowerCase().includes(search.toLowerCase()) ||
        b.location.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase());

      const matchWard = wardFilter === "ALL" || b.ward === wardFilter;

      let matchStatus = true;
      if (statusFilter === "OVERFLOW") matchStatus = b.fillLevel >= 85;
      else if (statusFilter === "NORMAL") matchStatus = b.fillLevel < 70;
      else if (statusFilter === "HIGH") matchStatus = b.fillLevel >= 70 && b.fillLevel < 85;

      return matchSearch && matchWard && matchStatus;
    });
  }, [smartBins, search, wardFilter, statusFilter]);

  const handleEmptyBin = (id, location) => {
    emptyBin(id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Trash2 size={24} color="#1b5e20" />
            <span>IoT Smart Bin Telemetry &amp; Monitoring</span>
          </h1>
          <p>
            Real-time ultrasonic fill level sensors, automatic overflow alerts, battery health, and scheduled collection dispatch.
          </p>
        </div>

        <div className="page-actions">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#16a34a", fontWeight: "700" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#16a34a" }} />
            <span>Telemetry Sensors Online ({smartBins.length})</span>
          </div>
        </div>
      </div>

      {/* Overflow Critical Warning Alert Banner */}
      {overflowBins.length > 0 && (
        <div
          style={{
            padding: "16px 20px",
            background: "#fff5f5",
            border: "1px solid #fecaca",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#dc2626"
              }}
            >
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: "14.5px", fontWeight: "800", color: "#991b1b" }}>
                CRITICAL OVERFLOW ALERT: {overflowBins.length} Smart Bins &gt; 85% Full
              </div>
              <div style={{ fontSize: "12.5px", color: "#7f1d1d" }}>
                Automated compaction alert triggered. Compactor trucks dispatched for immediate evacuation.
              </div>
            </div>
          </div>

          <button
            onClick={() => setStatusFilter("OVERFLOW")}
            className="btn btn-danger btn-sm"
          >
            Filter Overflowing Bins ({overflowBins.length})
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          alignItems: "center"
        }}
      >
        <div style={{ position: "relative" }}>
          <Search
            size={16}
            color="#7b9487"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="Search bin code, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: "36px" }}
          />
        </div>

        <select
          value={wardFilter}
          onChange={(e) => setWardFilter(e.target.value)}
          className="form-control form-select"
        >
          <option value="ALL">All Municipal Wards</option>
          {wards.map((w) => (
            <option key={w.id} value={w.name}>
              {w.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control form-select"
        >
          <option value="ALL">All Fill Levels</option>
          <option value="OVERFLOW">⚠️ Overflow Alerts (&gt;= 85%)</option>
          <option value="HIGH">High Fill Warning (70% - 84%)</option>
          <option value="NORMAL">Normal (&lt; 70%)</option>
        </select>
      </div>

      {/* Smart Bin Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px"
        }}
      >
        {filteredBins.map((bin) => {
          const isOverflow = bin.fillLevel >= 85;
          const isHigh = bin.fillLevel >= 70 && bin.fillLevel < 85;
          const barColor = isOverflow ? "#dc2626" : isHigh ? "#d97706" : "#16a34a";
          const bgColor = isOverflow ? "#fff9f9" : isHigh ? "#fffdf5" : "#ffffff";

          return (
            <div
              key={bin.id}
              className="card"
              style={{
                backgroundColor: bgColor,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px",
                borderColor: isOverflow ? "#fca5a5" : "var(--border-subtle)",
                boxShadow: isOverflow ? "0 4px 12px rgba(220, 38, 38, 0.08)" : "var(--shadow-sm)"
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#1b5e20" }}>
                      {bin.code} • {bin.ward?.split("-")[0]?.trim()}
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "800", color: "#132a1e", marginTop: "2px" }}>
                      {bin.location}
                    </div>
                  </div>

                  <span
                    className="badge"
                    style={{
                      backgroundColor: isOverflow ? "#fee2e2" : isHigh ? "#fef3c7" : "#dcfce7",
                      color: isOverflow ? "#991b1b" : isHigh ? "#92400e" : "#166534",
                      fontSize: "11px"
                    }}
                  >
                    {isOverflow ? "🔥 OVERFLOW" : `${bin.fillLevel}% FULL`}
                  </span>
                </div>

                {/* Fill Gauge Visualization */}
                <div style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                    <span style={{ color: "#4a6356", fontWeight: "600" }}>Ultrasonic Sensor Level</span>
                    <span style={{ fontWeight: "800", color: barColor }}>
                      {bin.fillLevel}% Capacity
                    </span>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "12px",
                      backgroundColor: "#eef2ef",
                      borderRadius: "999px",
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        width: `${bin.fillLevel}%`,
                        height: "100%",
                        backgroundColor: barColor,
                        borderRadius: "999px",
                        transition: "width 0.6s ease"
                      }}
                    />
                  </div>
                </div>

                {/* Meta details */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginTop: "16px",
                    paddingTop: "14px",
                    borderTop: "1px solid var(--border-subtle)",
                    fontSize: "12px",
                    color: "#4a6356"
                  }}
                >
                  <div>
                    <span style={{ color: "#7b9487" }}>Waste Stream:</span>
                    <div style={{ fontWeight: "700", color: "#132a1e" }}>{bin.category}</div>
                  </div>

                  <div>
                    <span style={{ color: "#7b9487" }}>Capacity / Vol:</span>
                    <div style={{ fontWeight: "700", color: "#132a1e" }}>{bin.capacityLiters} Liters</div>
                  </div>

                  <div>
                    <span style={{ color: "#7b9487" }}>Battery Level:</span>
                    <div style={{ fontWeight: "700", color: "#16a34a" }}>🔋 {bin.batteryLevel}%</div>
                  </div>

                  <div>
                    <span style={{ color: "#7b9487" }}>Sensor Temp:</span>
                    <div style={{ fontWeight: "700", color: "#132a1e" }}>{bin.temperatureC}°C</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "18px",
                  paddingTop: "14px",
                  borderTop: "1px solid var(--border-subtle)"
                }}
              >
                <button
                  onClick={() => handleEmptyBin(bin.id, bin.location)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, color: "#16a34a", borderColor: "#bbf7d0" }}
                  title="Simulate truck emptying this bin"
                >
                  <RefreshCw size={13} />
                  <span>Mark Emptied</span>
                </button>

                <a
                  href={`https://www.google.com/maps?q=${bin.lat},${bin.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: "6px 10px" }}
                  title="Locate on GPS Map"
                >
                  <MapPin size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
