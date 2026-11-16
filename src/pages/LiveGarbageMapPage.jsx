import { useState } from "react";
import { Link } from "react-router-dom";
import { useMunicipal } from "../context/MunicipalContext";
import LiveGarbageMap from "../components/map/LiveGarbageMap";
import { StatusBadge, PriorityBadge } from "../components/common/Badge";
import { postMunicipalHotspotAction } from "../services/api";
import {
  Map,
  MapPin,
  Layers,
  Truck,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Shield,
  Eye
} from "../components/common/Icons";

export default function LiveGarbageMapPage() {
  const {
    complaints,
    wards,
    smartBins,
    vehicles,
    updateComplaintStatus
  } = useMunicipal();

  const [selectedComplaint, setSelectedComplaint] = useState(complaints[0] || null);
  const [actionMessage, setActionMessage] = useState("");

  // Handle Municipal Direct Action on a Hotspot
  const handleTakeHotspotAction = async (complaint, actionType) => {
    setActionMessage("Executing municipal dispatch order...");
    try {
      if (actionType === "dispatch_truck") {
        updateComplaintStatus(
          complaint.id,
          "In-Progress",
          "Municipal Cleanup Compactor Truck Dispatched via Live GIS Map (ETA: 20 mins)."
        );
        setActionMessage(`🚚 Municipal Cleanup Truck dispatched to '${complaint.areaName}'!`);
      } else if (actionType === "install_bin") {
        setActionMessage(`🗑️ New Smart IoT Dustbin approved for installation at '${complaint.areaName}'.`);
      } else if (actionType === "mark_cleaned") {
        updateComplaintStatus(
          complaint.id,
          "Resolved",
          "Area cleared, power-washed, and verified by Ward Sanitation Inspector."
        );
        setActionMessage(`✅ Area '${complaint.areaName}' verified clean!`);
      }
      // Also post to backend if running
      await postMunicipalHotspotAction(101, actionType);
    } catch (err) {
      setActionMessage("Simulated municipal dispatch logged successfully.");
    }

    setTimeout(() => {
      setActionMessage("");
    }, 4500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Map size={24} color="#1b5e20" />
            <span>Live Municipal Garbage GIS Map</span>
          </h1>
          <p>
            Real-time GIS command map tracking citizen complaint pins, persistent waste hotspots, ward boundaries, and collection fleet telemetry.
          </p>
        </div>

        <div className="page-actions">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#1b5e20", fontWeight: "700" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#16a34a", boxShadow: "0 0 0 2px #bbf7d0" }} />
            <span>LIVE TELEMATICS FEED</span>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div
          style={{
            padding: "12px 18px",
            background: "#e8f5e9",
            borderRadius: "var(--radius-md)",
            border: "1px solid #c8e6c9",
            color: "#1b5e20",
            fontSize: "13.5px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <CheckCircle size={18} color="#16a34a" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Map + Selected Inspector Sidebar Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px", alignItems: "start" }}>
        {/* Full Interactive Leaflet Map */}
        <div className="card" style={{ padding: "6px", height: "720px" }}>
          <LiveGarbageMap
            height="100%"
            selectedComplaintId={selectedComplaint?.id}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
          />
        </div>

        {/* Selected Complaint / Hotspot Action Drawer */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {selectedComplaint ? (
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="card-header">
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#1b5e20" }}>
                    SELECTED HOTSPOT PIN
                  </span>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: "#132a1e" }}>
                    {selectedComplaint.areaName}
                  </div>
                </div>
                <StatusBadge status={selectedComplaint.status} />
              </div>

              <div style={{ fontSize: "12.5px", color: "#4a6356" }}>
                <strong>Ward:</strong> {selectedComplaint.ward}
              </div>

              <div style={{ fontSize: "12.5px", color: "#4a6356" }}>
                <strong>AI Category:</strong> {selectedComplaint.aiCategory} ({selectedComplaint.aiConfidence}%)
              </div>

              <div style={{ fontSize: "12.5px", color: "#4a6356" }}>
                <strong>Community Sightings:</strong>{" "}
                <span style={{ color: "#dc2626", fontWeight: "700" }}>
                  {selectedComplaint.reportsCount} citizen reports
                </span>
              </div>

              <p style={{ fontSize: "12px", color: "#374f42", fontStyle: "italic", background: "#f8faf8", padding: "10px", borderRadius: "8px" }}>
                "{selectedComplaint.citizenNotes || selectedComplaint.aiReasoning}"
              </p>

              {/* Direct Municipal Action Triggers */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#132a1e", textTransform: "uppercase" }}>
                  Rapid Municipal Action
                </span>

                <button
                  onClick={() => handleTakeHotspotAction(selectedComplaint, "dispatch_truck")}
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%", justifyContent: "flex-start", gap: "8px" }}
                >
                  <Truck size={14} />
                  <span>Dispatch Compactor Truck</span>
                </button>

                <button
                  onClick={() => handleTakeHotspotAction(selectedComplaint, "install_bin")}
                  className="btn btn-secondary btn-sm"
                  style={{ width: "100%", justifyContent: "flex-start", gap: "8px" }}
                >
                  <Trash2 size={14} />
                  <span>Approve Smart Bin Station</span>
                </button>

                <button
                  onClick={() => handleTakeHotspotAction(selectedComplaint, "mark_cleaned")}
                  className="btn btn-secondary btn-sm"
                  style={{ width: "100%", justifyContent: "flex-start", gap: "8px", color: "#16a34a", borderColor: "#bbf7d0" }}
                >
                  <CheckCircle size={14} />
                  <span>Mark Cleaned &amp; Verified</span>
                </button>

                <Link
                  to={`/complaints/${selectedComplaint.id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ width: "100%", marginTop: "4px" }}
                >
                  <span>Open Full Ticket Details</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "30px 20px", color: "#7b9487" }}>
              <MapPin size={24} style={{ margin: "0 auto 8px" }} />
              <div>Click any pin or circle on the map to inspect location details and issue field orders.</div>
            </div>
          )}

          {/* Quick Hotspot Watchlist */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="card-title" style={{ fontSize: "14px" }}>
              <AlertTriangle size={16} color="#dc2626" />
              <span>Priority Hotspot Clusters</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {complaints.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: selectedComplaint?.id === c.id ? "#e8f5e9" : "#f9fcf9",
                    border: selectedComplaint?.id === c.id ? "1px solid #a5d6a7" : "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    transition: "background 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: "700", color: "#132a1e" }}>
                      {c.areaName}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#dc2626" }}>
                      {c.reportsCount} logs
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#5a7567", marginTop: "2px" }}>
                    {c.ward} • {c.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
