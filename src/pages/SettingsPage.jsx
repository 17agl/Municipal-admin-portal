import { useState } from "react";
import { useMunicipal } from "../context/MunicipalContext";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/common/Modal";
import {
  Settings,
  Shield,
  Clock,
  Trash2,
  CheckCircle,
  Plus,
  RefreshCw,
  Users
} from "../components/common/Icons";

export default function SettingsPage() {
  const {
    settings,
    setSettings,
    wards,
    updateWard,
    resetAllDataToDefault
  } = useMunicipal();

  const { adminUser } = useAuth();

  const [activeTab, setActiveTab] = useState("wards"); // 'wards' | 'priorities' | 'rules' | 'permissions'
  const [saveMessage, setSaveMessage] = useState("");

  // Wards Edit State
  const [editingWard, setEditingWard] = useState(null);
  const [wardSupervisor, setWardSupervisor] = useState("");
  const [wardTargetTons, setWardTargetTons] = useState("");

  // SLA Thresholds Local State
  const [slaP1, setSlaP1] = useState(settings.slaPriorities?.P1?.maxHours || 4);
  const [slaP2, setSlaP2] = useState(settings.slaPriorities?.P2?.maxHours || 12);
  const [slaP3, setSlaP3] = useState(settings.slaPriorities?.P3?.maxHours || 24);
  const [slaP4, setSlaP4] = useState(settings.slaPriorities?.P4?.maxHours || 48);

  const handleSaveSLA = () => {
    setSettings((prev) => ({
      ...prev,
      slaPriorities: {
        ...prev.slaPriorities,
        P1: { ...prev.slaPriorities.P1, maxHours: Number(slaP1) },
        P2: { ...prev.slaPriorities.P2, maxHours: Number(slaP2) },
        P3: { ...prev.slaPriorities.P3, maxHours: Number(slaP3) },
        P4: { ...prev.slaPriorities.P4, maxHours: Number(slaP4) }
      }
    }));
    setSaveMessage("SLA priority response thresholds saved.");
    setTimeout(() => setSaveMessage(""), 3500);
  };

  const handleOpenEditWard = (w) => {
    setEditingWard(w);
    setWardSupervisor(w.supervisor);
    setWardTargetTons(w.dailyWasteTargetTons);
  };

  const handleSaveWard = () => {
    if (!editingWard) return;
    updateWard(editingWard.id, {
      supervisor: wardSupervisor,
      dailyWasteTargetTons: Number(wardTargetTons) || editingWard.dailyWasteTargetTons
    });
    setEditingWard(null);
    setSaveMessage(`Ward '${editingWard.name}' updated.`);
    setTimeout(() => setSaveMessage(""), 3500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Settings size={24} color="#1b5e20" />
            <span>Municipal System Settings &amp; Configuration</span>
          </h1>
          <p>
            Configure ward boundaries, SLA escalation timelines, municipal waste sorting bye-laws, and user access permissions.
          </p>
        </div>

        <div className="page-actions">
          <button
            onClick={() => {
              if (window.confirm("Reset all test data back to official defaults? This will clear local changes.")) {
                resetAllDataToDefault();
                setSaveMessage("All system data reset to defaults.");
                setTimeout(() => setSaveMessage(""), 3500);
              }
            }}
            className="btn btn-secondary btn-sm"
            style={{ color: "#dc2626", borderColor: "#fca5a5" }}
          >
            <RefreshCw size={13} />
            <span>Reset Demo Store</span>
          </button>
        </div>
      </div>

      {saveMessage && (
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
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px", flexWrap: "wrap" }}>
        {[
          { key: "wards", label: "Ward Management" },
          { key: "priorities", label: "SLA & Priorities" },
          { key: "rules", label: "Local Recycling Rules" },
          { key: "permissions", label: "Permissions & Roles" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: activeTab === tab.key ? "700" : "500",
              backgroundColor: activeTab === tab.key ? "#e8f5e9" : "transparent",
              color: activeTab === tab.key ? "#1b5e20" : "#4a6356"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================
          TAB 1: WARD MANAGEMENT
          ============================================================ */}
      {activeTab === "wards" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="card-header" style={{ padding: "20px 24px", margin: 0, borderBottom: "1px solid var(--border-subtle)" }}>
            <div>
              <div className="card-title">
                <Shield size={18} color="#1b5e20" />
                <span>Municipal Ward Boundaries &amp; Supervisors</span>
              </div>
              <div className="card-subtitle">
                Supervisory jurisdictions, daily waste targets, and assigned sanitary officers
              </div>
            </div>
          </div>

          <div className="table-container" style={{ border: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ward Code</th>
                  <th>Ward Name</th>
                  <th>Area Supervisor</th>
                  <th>Contact Phone</th>
                  <th>Daily Target</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {wards.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <span style={{ fontWeight: "800", color: "#1b5e20" }}>{w.code}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: "700" }}>{w.name}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: "600", color: "#132a1e" }}>{w.supervisor}</div>
                    </td>
                    <td style={{ fontSize: "12px", color: "#5a7567" }}>
                      {w.supervisorPhone}
                    </td>
                    <td>
                      <div style={{ fontWeight: "700" }}>{w.dailyWasteTargetTons} Tons/day</div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenEditWard(w)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "4px 10px" }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: SLA & PRIORITY THRESHOLDS
          ============================================================ */}
      {activeTab === "priorities" && (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card-header">
            <div>
              <div className="card-title">
                <Clock size={18} color="#1b5e20" />
                <span>Service Level Agreement (SLA) Resolution Thresholds</span>
              </div>
              <div className="card-subtitle">
                Maximum resolution response window before automated supervisor alert and escalation
              </div>
            </div>
            <button onClick={handleSaveSLA} className="btn btn-primary btn-sm">
              Save Thresholds
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#fef2f2", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid #fecaca" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#991b1b" }}>P1 - Immediate / Hotspot</div>
              <p style={{ fontSize: "12px", color: "#b91c1c", marginTop: "2px", marginBottom: "12px" }}>
                Critical environmental hazards, drainage blockages, hazardous dumping.
              </p>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: "#991b1b" }}>Max Resolution Window (Hours)</label>
                <input
                  type="number"
                  value={slaP1}
                  onChange={(e) => setSlaP1(e.target.value)}
                  className="form-control"
                  style={{ borderColor: "#fca5a5" }}
                />
              </div>
            </div>

            <div style={{ background: "#fff7ed", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid #ffedd5" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#9a3412" }}>P2 - High Priority</div>
              <p style={{ fontSize: "12px", color: "#c2410c", marginTop: "2px", marginBottom: "12px" }}>
                Market overflows, commercial garbage, public transit litter.
              </p>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: "#9a3412" }}>Max Resolution Window (Hours)</label>
                <input
                  type="number"
                  value={slaP2}
                  onChange={(e) => setSlaP2(e.target.value)}
                  className="form-control"
                  style={{ borderColor: "#fdba74" }}
                />
              </div>
            </div>

            <div style={{ background: "#fefce8", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid #fef08a" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#854d0e" }}>P3 - Standard Accumulation</div>
              <p style={{ fontSize: "12px", color: "#a16207", marginTop: "2px", marginBottom: "12px" }}>
                Residential colony bins, packaging cartons, roadside sweep requests.
              </p>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: "#854d0e" }}>Max Resolution Window (Hours)</label>
                <input
                  type="number"
                  value={slaP3}
                  onChange={(e) => setSlaP3(e.target.value)}
                  className="form-control"
                  style={{ borderColor: "#fde047" }}
                />
              </div>
            </div>

            <div style={{ background: "#f0f9ff", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid #e0f2fe" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#075985" }}>P4 - Low / Minor Litter</div>
              <p style={{ fontSize: "12px", color: "#0284c7", marginTop: "2px", marginBottom: "12px" }}>
                Small pedestrian litter, graffiti cleaning, public awareness notices.
              </p>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: "#075985" }}>Max Resolution Window (Hours)</label>
                <input
                  type="number"
                  value={slaP4}
                  onChange={(e) => setSlaP4(e.target.value)}
                  className="form-control"
                  style={{ borderColor: "#7dd3fc" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 3: LOCAL RECYCLING RULES & BYE-LAWS
          ============================================================ */}
      {activeTab === "rules" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="card-header" style={{ padding: "20px 24px", margin: 0, borderBottom: "1px solid var(--border-subtle)" }}>
            <div>
              <div className="card-title">
                <Trash2 size={18} color="#1b5e20" />
                <span>Municipal Solid Waste Bye-Laws &amp; Sorting Guidelines</span>
              </div>
              <div className="card-subtitle">
                Enforcement directives used by AI computer vision classification and ward sweepers
              </div>
            </div>
          </div>

          <div className="table-container" style={{ border: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Waste Stream</th>
                  <th>Mandatory Sorting Guideline</th>
                  <th>Authorized Processing Facility</th>
                </tr>
              </thead>
              <tbody>
                {settings.recyclingRules?.map((r, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong style={{ color: "#132a1e" }}>{r.category}</strong>
                    </td>
                    <td style={{ fontSize: "13px", color: "#374f42" }}>
                      {r.rule}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: "700",
                          background: "#e8f5e9",
                          color: "#1b5e20",
                          padding: "3px 8px",
                          borderRadius: "6px"
                        }}
                      >
                        {r.disposalPartner}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 4: PERMISSIONS & ROLES
          ============================================================ */}
      {activeTab === "permissions" && (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card-header">
            <div>
              <div className="card-title">
                <Users size={18} color="#1b5e20" />
                <span>Municipal Admin Profile &amp; Role Hierarchy</span>
              </div>
              <div className="card-subtitle">
                Access tokens, role capabilities, and portal credentials
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
            <img
              src={adminUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80"}
              alt="Admin"
              style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "3px solid #c8e6c9" }}
            />
            <div>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#132a1e" }}>
                {adminUser?.name}
              </div>
              <div style={{ fontSize: "13px", color: "#1b5e20", fontWeight: "700" }}>
                {adminUser?.role}
              </div>
              <div style={{ fontSize: "12px", color: "#6b8075" }}>
                {adminUser?.department} • ID: {adminUser?.employeeId}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "14px",
              marginTop: "8px"
            }}
          >
            <div style={{ background: "#f8faf8", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontWeight: "800", color: "#1b5e20", fontSize: "13px" }}>Super Admin (Commissioner)</div>
              <div style={{ fontSize: "12px", color: "#5a7567", marginTop: "4px" }}>
                Full city-wide command, budget approvals, ward SLA reconfigurations, and staff promotions.
              </div>
            </div>

            <div style={{ background: "#f8faf8", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontWeight: "800", color: "#2563eb", fontSize: "13px" }}>Ward Sanitary Officer</div>
              <div style={{ fontSize: "12px", color: "#5a7567", marginTop: "4px" }}>
                Local ward complaint assignments, driver dispatch, smart bin clearance verification.
              </div>
            </div>

            <div style={{ background: "#f8faf8", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontWeight: "800", color: "#7c3aed", fontSize: "13px" }}>Dispatcher &amp; Telematics Desk</div>
              <div style={{ fontSize: "12px", color: "#5a7567", marginTop: "4px" }}>
                Fleet truck route management, weighbridge scale recording, driver checkpoint pacing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Ward Modal */}
      <Modal
        isOpen={Boolean(editingWard)}
        onClose={() => setEditingWard(null)}
        title={`Edit Jurisdiction: ${editingWard?.name}`}
        icon={Shield}
        footer={
          <>
            <button onClick={() => setEditingWard(null)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveWard} className="btn btn-primary">
              Save Ward Settings
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="form-group">
            <label className="form-label">Ward Supervisor Name</label>
            <input
              type="text"
              value={wardSupervisor}
              onChange={(e) => setWardSupervisor(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Daily Waste Target (Tons)</label>
            <input
              type="number"
              step="0.1"
              value={wardTargetTons}
              onChange={(e) => setWardTargetTons(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
