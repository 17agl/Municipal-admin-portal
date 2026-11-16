import { useState, useMemo } from "react";
import { useMunicipal } from "../context/MunicipalContext";
import Modal from "../components/common/Modal";
import { exportToCSV } from "../services/reportGenerator";
import {
  Truck,
  Plus,
  Download,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  TrendingUp,
  FileText
} from "../components/common/Icons";

export default function CollectionManagement() {
  const {
    collections,
    vehicles,
    wards,
    addCollectionRecord,
    updateVehicle
  } = useMunicipal();

  const [activeTab, setActiveTab] = useState("records"); // 'records' | 'vehicles'
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("ALL");

  // New Collection Record Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState(vehicles[0]?.plateNumber || "DL-1GB-4091");
  const [vehicleType, setVehicleType] = useState(vehicles[0]?.type || "Compactor Truck (12T)");
  const [driverName, setDriverName] = useState("Sunil Verma");
  const [ward, setWard] = useState(wards[0]?.name || "Ward 1 - Central Market & Bazaar");
  const [wasteCategory, setWasteCategory] = useState("Dry Mixed Recyclables");
  const [grossWeightKg, setGrossWeightKg] = useState("14200");
  const [tareWeightKg, setTareWeightKg] = useState("8200");
  const [destinationFacility, setDestinationFacility] = useState("Okhla Waste-to-Energy & Material Recovery Facility");

  // Calculate Net Waste
  const calculatedNetKg = Math.max(0, (Number(grossWeightKg) || 0) - (Number(tareWeightKg) || 0));

  const totalCollectedTodayKg = useMemo(() => {
    return collections.reduce((acc, col) => acc + (Number(col.netWasteKg) || 0), 0);
  }, [collections]);

  const filteredRecords = useMemo(() => {
    return collections.filter((col) => {
      const matchSearch =
        !search.trim() ||
        col.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
        col.driverName.toLowerCase().includes(search.toLowerCase()) ||
        col.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
        col.wasteCategory.toLowerCase().includes(search.toLowerCase());

      const matchWard = wardFilter === "ALL" || col.ward === wardFilter;
      return matchSearch && matchWard;
    });
  }, [collections, search, wardFilter]);

  const handleCreateRecord = (e) => {
    e.preventDefault();
    addCollectionRecord({
      vehicleNumber,
      vehicleType,
      driverName,
      ward,
      wasteCategory,
      grossWeightKg: Number(grossWeightKg) || 0,
      tareWeightKg: Number(tareWeightKg) || 0,
      netWasteKg: calculatedNetKg,
      destinationFacility
    });

    setModalOpen(false);
  };

  const handleExportCSV = () => {
    const rows = filteredRecords.map((r) => ({
      Ticket_No: r.ticketNo,
      Date: r.date,
      Time: r.time,
      Vehicle: r.vehicleNumber,
      Type: r.vehicleType,
      Driver: r.driverName,
      Ward: r.ward,
      Category: r.wasteCategory,
      Gross_Weight_Kg: r.grossWeightKg,
      Tare_Weight_Kg: r.tareWeightKg,
      Net_Waste_Kg: r.netWasteKg,
      Disposal_Facility: r.destinationFacility,
      Status: r.status
    }));
    exportToCSV("EcoSort_Collection_Weights_Audit", rows);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Truck size={24} color="#1b5e20" />
            <span>Collection &amp; Weighbridge Management</span>
          </h1>
          <p>
            Monitor automated weighbridge tickets, net waste tonnages, transport disposal logs, and municipal fleet assets.
          </p>
        </div>

        <div className="page-actions">
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <Download size={16} />
            <span>Export Slips</span>
          </button>
          <button onClick={() => setModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Record Weighbridge Entry</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Tiles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px"
        }}
      >
        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#6b8075", textTransform: "uppercase" }}>
            Total Waste Cleared Today
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#1b5e20", marginTop: "4px" }}>
            {(totalCollectedTodayKg / 1000).toFixed(2)} Tons
          </div>
          <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "4px", fontWeight: "600" }}>
            {totalCollectedTodayKg.toLocaleString()} kg net mass
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#6b8075", textTransform: "uppercase" }}>
            Disposal Weighbridge Slips
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#2563eb", marginTop: "4px" }}>
            {collections.length} Trips Logged
          </div>
          <div style={{ fontSize: "12px", color: "#6b8075", marginTop: "4px" }}>
            All weighbridge tickets verified
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#6b8075", textTransform: "uppercase" }}>
            Active Fleet Vehicles
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#7c3aed", marginTop: "4px" }}>
            {vehicles.filter((v) => v.status.includes("Route") || v.status.includes("Transit") || v.status.includes("Patrol")).length} / {vehicles.length}
          </div>
          <div style={{ fontSize: "12px", color: "#6b8075", marginTop: "4px" }}>
            GPS telemetry broadcast active
          </div>
        </div>

        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#6b8075", textTransform: "uppercase" }}>
            MRF / Composter Diversion
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#15803d", marginTop: "4px" }}>
            82.4%
          </div>
          <div style={{ fontSize: "12px", color: "#15803d", marginTop: "4px", fontWeight: "600" }}>
            Clean organic &amp; dry recovery
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Records vs Fleet */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px" }}>
        <button
          onClick={() => setActiveTab("records")}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: activeTab === "records" ? "700" : "500",
            backgroundColor: activeTab === "records" ? "#e8f5e9" : "transparent",
            color: activeTab === "records" ? "#1b5e20" : "#4a6356"
          }}
        >
          Weighbridge Intake Records ({collections.length})
        </button>

        <button
          onClick={() => setActiveTab("vehicles")}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: activeTab === "vehicles" ? "700" : "500",
            backgroundColor: activeTab === "vehicles" ? "#e8f5e9" : "transparent",
            color: activeTab === "vehicles" ? "#1b5e20" : "#4a6356"
          }}
        >
          Municipal Fleet Vehicles ({vehicles.length})
        </button>
      </div>

      {/* ============================================================
          TAB 1: WEIGHBRIDGE RECORDS TABLE
          ============================================================ */}
      {activeTab === "records" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Filters */}
          <div
            className="card"
            style={{
              padding: "14px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <div style={{ position: "relative", width: "280px" }}>
              <Search
                size={16}
                color="#7b9487"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                placeholder="Search ticket, truck, driver..."
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
              style={{ width: "auto" }}
            >
              <option value="ALL">All Municipal Wards</option>
              {wards.map((w) => (
                <option key={w.id} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-container" style={{ border: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Slip No / Time</th>
                    <th>Vehicle &amp; Type</th>
                    <th>Driver &amp; Ward</th>
                    <th>Waste Stream</th>
                    <th>Gross / Tare</th>
                    <th>Net Waste (kg)</th>
                    <th>Disposal Destination</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((col) => (
                    <tr key={col.id}>
                      <td>
                        <div style={{ fontWeight: "800", color: "#1b5e20" }}>{col.ticketNo}</div>
                        <div style={{ fontSize: "11px", color: "#7b9487" }}>
                          {col.date} • {col.time}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: "700", color: "#132a1e" }}>{col.vehicleNumber}</div>
                        <div style={{ fontSize: "11.5px", color: "#5a7567" }}>{col.vehicleType}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: "600", color: "#132a1e" }}>{col.driverName}</div>
                        <div style={{ fontSize: "11.5px", color: "#5a7567" }}>{col.ward}</div>
                      </td>

                      <td>
                        <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#2e7d32" }}>
                          {col.wasteCategory}
                        </span>
                      </td>

                      <td style={{ fontSize: "12px", color: "#5a7567" }}>
                        <div>Gross: {col.grossWeightKg.toLocaleString()} kg</div>
                        <div>Tare: {col.tareWeightKg.toLocaleString()} kg</div>
                      </td>

                      <td>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "#1b5e20" }}>
                          {col.netWasteKg.toLocaleString()} kg
                        </div>
                        <div style={{ fontSize: "11px", color: "#16a34a" }}>
                          {(col.netWasteKg / 1000).toFixed(2)} Tons
                        </div>
                      </td>

                      <td style={{ maxWidth: "220px", fontSize: "12px", color: "#374f42" }}>
                        {col.destinationFacility}
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: col.status.includes("Verified") ? "#dcfce7" : "#eff6ff",
                            color: col.status.includes("Verified") ? "#166534" : "#1d4ed8",
                            border: col.status.includes("Verified") ? "1px solid #bbf7d0" : "1px solid #bfdbfe"
                          }}
                        >
                          {col.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: VEHICLE FLEET INVENTORY
          ============================================================ */}
      {activeTab === "vehicles" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px"
          }}
        >
          {vehicles.map((v) => {
            const loadPercent = Math.round((v.currentLoadTons / v.capacityTons) * 100);

            return (
              <div
                key={v.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "20px"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "800", color: "#132a1e" }}>
                        {v.plateNumber}
                      </div>
                      <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>
                        {v.model}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "999px",
                        backgroundColor: v.status.includes("Route") ? "#dbeafe" : "#f1f5f9",
                        color: v.status.includes("Route") ? "#1e40af" : "#475569"
                      }}
                    >
                      {v.status}
                    </span>
                  </div>

                  <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12.5px" }}>
                    <div><strong>Driver:</strong> {v.currentDriver}</div>
                    <div><strong>Ward:</strong> {v.ward}</div>
                    <div><strong>Type:</strong> {v.type} ({v.co2Rating})</div>
                    <div><strong>Speed / Telemetry:</strong> {v.speedKmH} km/h • Fuel/SoC: {v.fuelLevel}%</div>
                  </div>

                  {/* Load Utilization Meter */}
                  <div style={{ marginTop: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                      <span style={{ color: "#6b8075" }}>Payload Utilization</span>
                      <span style={{ fontWeight: "700", color: "#132a1e" }}>
                        {v.currentLoadTons} / {v.capacityTons} Tons ({loadPercent}%)
                      </span>
                    </div>

                    <div style={{ width: "100%", height: "8px", backgroundColor: "#e2ebe4", borderRadius: "999px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${loadPercent}%`,
                          height: "100%",
                          backgroundColor: loadPercent > 80 ? "#dc2626" : "#2e7d32",
                          borderRadius: "999px"
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)", fontSize: "11.5px", color: "#7b9487" }}>
                  Last Preventive Service: {v.lastServiceDate}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================
          NEW WEIGHBRIDGE SLIP MODAL
          ============================================================ */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Weighbridge Waste Entry"
        icon={Truck}
        maxWidth="640px"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreateRecord} className="btn btn-primary">
              Generate Weighbridge Slip
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateRecord} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Vehicle Registration *</label>
              <select
                value={vehicleNumber}
                onChange={(e) => {
                  setVehicleNumber(e.target.value);
                  const found = vehicles.find((v) => v.plateNumber === e.target.value);
                  if (found) {
                    setVehicleType(found.type);
                    setDriverName(found.currentDriver);
                  }
                }}
                className="form-control form-select"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plateNumber}>
                    {v.plateNumber} — {v.type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Driver Name *</label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Source Ward *</label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
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
              <label className="form-label">Waste Category *</label>
              <select
                value={wasteCategory}
                onChange={(e) => setWasteCategory(e.target.value)}
                className="form-control form-select"
              >
                <option value="Dry Mixed Recyclables">Dry Mixed Recyclables</option>
                <option value="Floral & Organic Scraps">Floral &amp; Organic Scraps</option>
                <option value="Plastic & Commercial Film">Plastic &amp; Commercial Film</option>
                <option value="Clean Paper & Corrugated Cardboard">Clean Paper &amp; Cardboard</option>
                <option value="E-Waste & Battery Scrap">E-Waste &amp; Battery Scrap</option>
              </select>
            </div>
          </div>

          {/* Weighbridge Scales Simulation */}
          <div
            style={{
              padding: "16px",
              background: "#f4f8f5",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <div style={{ fontSize: "12.5px", fontWeight: "800", color: "#1b5e20", textTransform: "uppercase" }}>
              Automated Weighbridge Scale Readout
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <label className="form-label">Gross Mass (kg) *</label>
                <input
                  type="number"
                  value={grossWeightKg}
                  onChange={(e) => setGrossWeightKg(e.target.value)}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Tare / Empty Truck (kg) *</label>
                <input
                  type="number"
                  value={tareWeightKg}
                  onChange={(e) => setTareWeightKg(e.target.value)}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Net Waste Mass</label>
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#ffffff",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-strong)",
                    fontWeight: "800",
                    color: "#1b5e20",
                    fontSize: "15px"
                  }}
                >
                  {calculatedNetKg.toLocaleString()} kg
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Disposal / MRF Facility Destination *</label>
            <input
              type="text"
              required
              value={destinationFacility}
              onChange={(e) => setDestinationFacility(e.target.value)}
              className="form-control"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
