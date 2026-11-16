import { useState } from "react";
import { useMunicipal } from "../context/MunicipalContext";
import Modal from "../components/common/Modal";
import {
  Route,
  Truck,
  Plus,
  MapPin,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Zap
} from "../components/common/Icons";

export default function RouteManagement() {
  const { routes, vehicles, staff, wards, updateRoute, completeStop } = useMunicipal();

  const [selectedRoute, setSelectedRoute] = useState(routes[0] || null);
  const [newRouteModalOpen, setNewRouteModalOpen] = useState(false);

  // New Route Form
  const [routeName, setRouteName] = useState("");
  const [routeWard, setRouteWard] = useState(wards[0]?.name || "Ward 1 - Central Market & Bazaar");
  const [routeVehicle, setRouteVehicle] = useState(vehicles[0]?.plateNumber || "DL-1GB-4091 (Compactor Truck)");
  const [routeDriver, setRouteDriver] = useState("Sunil Verma");
  const [routeDistance, setRouteDistance] = useState("16.5");
  const [routeDuration, setRouteDuration] = useState("2 hrs 00 mins");

  const handleApplyAISuggestion = (routeId) => {
    updateRoute(routeId, {
      aiOptimizationSuggestion: "✅ Route dynamic optimization applied! Telematics synced to Driver Mobile Terminal."
    });
  };

  const handleCreateRoute = (e) => {
    e.preventDefault();
    // Simulate creating route
    setNewRouteModalOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Route size={24} color="#1b5e20" />
            <span>Collection Route Optimization &amp; Dispatch</span>
          </h1>
          <p>
            Monitor live collection circuits, stop progression checkpoints, and AI-driven dynamic rerouting to minimize fuel burn and bypass traffic.
          </p>
        </div>

        <div className="page-actions">
          <button onClick={() => setNewRouteModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Create New Circuit</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column: Routes List + Route Detail / Stop Progression */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "24px" }}>
        {/* Left Column: Routes List & AI Optimization Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="card-title" style={{ fontSize: "15px" }}>
            <span>Active Municipal Collection Circuits ({routes.length})</span>
          </div>

          {routes.map((r) => {
            const isSelected = selectedRoute?.id === r.id;
            const progressPct = Math.round((r.completedStops / r.totalStops) * 100);

            return (
              <div
                key={r.id}
                onClick={() => setSelectedRoute(r)}
                className="card"
                style={{
                  cursor: "pointer",
                  borderColor: isSelected ? "#2e7d32" : "var(--border-subtle)",
                  borderWidth: isSelected ? "2px" : "1px",
                  background: isSelected ? "#fcfffc" : "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#1b5e20" }}>
                      {r.id} • {r.ward}
                    </span>
                    <div style={{ fontSize: "15px", fontWeight: "800", color: "#132a1e", marginTop: "2px" }}>
                      {r.name}
                    </div>
                  </div>

                  <span
                    className="badge"
                    style={{
                      backgroundColor: r.status === "Completed" ? "#dcfce7" : "#eff6ff",
                      color: r.status === "Completed" ? "#166534" : "#1d4ed8"
                    }}
                  >
                    {r.status}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", color: "#4a6356" }}>
                  <div><strong>Truck:</strong> {r.assignedVehicle}</div>
                  <div><strong>Driver:</strong> {r.driverName}</div>
                  <div><strong>Circuit Length:</strong> {r.totalDistanceKm} km</div>
                  <div><strong>Est. Time:</strong> {r.estimatedDuration}</div>
                </div>

                {/* Progress */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "4px" }}>
                    <span style={{ color: "#6b8075" }}>Stop Checkpoints</span>
                    <span style={{ fontWeight: "700", color: "#1b5e20" }}>
                      {r.completedStops} / {r.totalStops} completed ({progressPct}%)
                    </span>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: "#e2ebe4", borderRadius: "999px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${progressPct}%`,
                        height: "100%",
                        backgroundColor: progressPct === 100 ? "#16a34a" : "#2563eb",
                        borderRadius: "999px"
                      }}
                    />
                  </div>
                </div>

                {/* AI Route Suggestion Callout */}
                {r.aiOptimizationSuggestion && (
                  <div
                    style={{
                      background: "#fdf8ee",
                      border: "1px solid #fef08a",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      fontSize: "12px",
                      color: "#854d0e",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px"
                    }}
                  >
                    <Sparkles size={16} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ flex: 1 }}>
                      <div>{r.aiOptimizationSuggestion}</div>
                      {!r.aiOptimizationSuggestion.includes("applied") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyAISuggestion(r.id);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{
                            marginTop: "6px",
                            padding: "3px 8px",
                            fontSize: "11px",
                            borderColor: "#d97706",
                            color: "#854d0e"
                          }}
                        >
                          ⚡ Apply Suggested Reroute
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Stop Checkpoints Breakdown for Selected Route */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {selectedRoute ? (
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="card-header">
                <div>
                  <div className="card-title">
                    <MapPin size={18} color="#1b5e20" />
                    <span>Checkpoints: {selectedRoute.name}</span>
                  </div>
                  <div className="card-subtitle">
                    Assigned: {selectedRoute.assignedVehicle} • {selectedRoute.driverName}
                  </div>
                </div>
              </div>

              {/* Stops Timeline */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {selectedRoute.stops.map((stop, idx) => {
                  const isCompleted = stop.status === "Completed";
                  const isInProgress = stop.status === "In Progress";

                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: "var(--radius-md)",
                        background: isCompleted ? "#f0fdf4" : isInProgress ? "#eff6ff" : "#f8faf8",
                        border: isCompleted ? "1px solid #bbf7d0" : isInProgress ? "1px solid #bfdbfe" : "1px solid var(--border-subtle)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: isCompleted ? "#16a34a" : isInProgress ? "#2563eb" : "#d1d5db",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "800"
                          }}
                        >
                          {isCompleted ? "✓" : idx + 1}
                        </div>

                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: "#132a1e" }}>
                            {stop.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "#6b8075" }}>
                            Expected: {stop.time}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: isCompleted ? "#16a34a" : isInProgress ? "#2563eb" : "#6b8075"
                          }}
                        >
                          {stop.status}
                        </span>

                        {!isCompleted && (
                          <button
                            onClick={() => completeStop(selectedRoute.id, idx)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                          >
                            Mark Picked
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Route Summary KPI */}
              <div
                style={{
                  padding: "14px",
                  background: "#f4f8f5",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px"
                }}
              >
                <div>
                  <span style={{ color: "#6b8075" }}>Circuit Distance:</span>{" "}
                  <strong>{selectedRoute.totalDistanceKm} km</strong>
                </div>
                <div>
                  <span style={{ color: "#6b8075" }}>Waste Cleared:</span>{" "}
                  <strong>{(selectedRoute.wasteCollectedKg / 1000).toFixed(2)} Tons</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
              Select a collection route from the list to view checkpoints.
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          CREATE ROUTE MODAL
          ============================================================ */}
      <Modal
        isOpen={newRouteModalOpen}
        onClose={() => setNewRouteModalOpen(false)}
        title="Plan New Collection Circuit"
        icon={Route}
        footer={
          <>
            <button onClick={() => setNewRouteModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreateRoute} className="btn btn-primary">
              Generate Route Sequence
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateRoute} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="form-group">
            <label className="form-label">Route Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Route 5B: Heritage Old City Commercial Circuit"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Ward Jurisdiction</label>
              <select
                value={routeWard}
                onChange={(e) => setRouteWard(e.target.value)}
                className="form-control form-select"
              >
                {wards.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Vehicle</label>
              <select
                value={routeVehicle}
                onChange={(e) => setRouteVehicle(e.target.value)}
                className="form-control form-select"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plateNumber}>
                    {v.plateNumber} ({v.type})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
