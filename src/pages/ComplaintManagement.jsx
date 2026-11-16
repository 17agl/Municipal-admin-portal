import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMunicipal } from "../context/MunicipalContext";
import { StatusBadge, PriorityBadge, SeverityBadge } from "../components/common/Badge";
import Modal from "../components/common/Modal";
import { exportToCSV } from "../services/reportGenerator";
import {
  FileText,
  Search,
  Filter,
  Users,
  CheckCircle,
  AlertTriangle,
  Download,
  Plus,
  Eye,
  Clock,
  Sparkles
} from "../components/common/Icons";

export default function ComplaintManagement() {
  const {
    complaints,
    staff,
    wards,
    assignComplaint,
    updateComplaintStatus,
    prioritizeComplaint,
    addComplaint
  } = useMunicipal();

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [wardFilter, setWardFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Assignment Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [dispatchNotes, setDispatchNotes] = useState("");

  // Priority Change Modal State
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [newPriorityValue, setNewPriorityValue] = useState("P1 - Immediate");

  // New Complaint Intake Modal State
  const [newComplaintModalOpen, setNewComplaintModalOpen] = useState(false);
  const [newArea, setNewArea] = useState("");
  const [newWard, setNewWard] = useState(wards[0]?.name || "Ward 1 - Central Market & Bazaar");
  const [newCategory, setNewCategory] = useState("Plastic & Mixed Packaging");
  const [newCitizenName, setNewCitizenName] = useState("");
  const [newCitizenPhone, setNewCitizenPhone] = useState("");
  const [newPriority, setNewPriority] = useState("P2 - High");
  const [newNotes, setNewNotes] = useState("");

  // Filter complaints
  const filteredList = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        !search.trim() ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.areaName.toLowerCase().includes(search.toLowerCase()) ||
        c.citizenName.toLowerCase().includes(search.toLowerCase()) ||
        c.aiCategory.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
      const matchWard = wardFilter === "ALL" || c.ward === wardFilter;
      const matchPriority = priorityFilter === "ALL" || c.priority.startsWith(priorityFilter);
      const matchCategory = categoryFilter === "ALL" || c.aiCategory === categoryFilter;

      return matchSearch && matchStatus && matchWard && matchPriority && matchCategory;
    });
  }, [complaints, search, statusFilter, wardFilter, priorityFilter, categoryFilter]);

  // Open Assign Modal
  const handleOpenAssign = (complaint) => {
    setSelectedComplaint(complaint);
    setSelectedStaffId(complaint.assignedTo || (staff[0]?.id || ""));
    setDeadlineInput(
      complaint.deadline
        ? new Date(complaint.deadline).toISOString().slice(0, 16)
        : new Date(Date.now() + 6 * 3600000).toISOString().slice(0, 16)
    );
    setDispatchNotes("");
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedComplaint || !selectedStaffId) return;
    assignComplaint(
      selectedComplaint.id,
      selectedStaffId,
      new Date(deadlineInput).toISOString(),
      dispatchNotes
    );
    setAssignModalOpen(false);
  };

  // Open Priority Modal
  const handleOpenPriority = (complaint) => {
    setSelectedComplaint(complaint);
    setNewPriorityValue(complaint.priority || "P1 - Immediate");
    setPriorityModalOpen(true);
  };

  const handleConfirmPriority = () => {
    if (!selectedComplaint) return;
    prioritizeComplaint(selectedComplaint.id, newPriorityValue);
    setPriorityModalOpen(false);
  };

  // Create Manual Intake Complaint
  const handleCreateComplaint = (e) => {
    e.preventDefault();
    if (!newArea.trim()) return;

    addComplaint({
      citizenName: newCitizenName || "Municipal Hotline Intake",
      citizenPhone: newCitizenPhone || "+91 1800-ECO-SORT",
      citizenEmail: "hotline@ecosort.gov.in",
      areaName: newArea,
      ward: newWard,
      address: `${newArea}, ${newWard}`,
      lat: 28.618 + (Math.random() - 0.5) * 0.03,
      lng: 77.215 + (Math.random() - 0.5) * 0.03,
      aiCategory: newCategory,
      aiConfidence: 91.5,
      aiReasoning: "Administrative operator intake verified with sanitation guidelines.",
      severity: newPriority.startsWith("P1") ? "Critical" : newPriority.startsWith("P2") ? "High" : "Medium",
      priority: newPriority,
      reportsCount: 1,
      citizenNotes: newNotes || "Logged directly through Municipal Administrative Command.",
      imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
      resolutionNotes: ""
    });

    setNewComplaintModalOpen(false);
    setNewArea("");
    setNewCitizenName("");
    setNewCitizenPhone("");
    setNewNotes("");
  };

  const handleExportCSV = () => {
    const rows = filteredList.map((c) => ({
      ID: c.id,
      Citizen: c.citizenName,
      Phone: c.citizenPhone,
      Ward: c.ward,
      Area: c.areaName,
      AI_Category: c.aiCategory,
      Confidence: `${c.aiConfidence}%`,
      Priority: c.priority,
      Status: c.status,
      Assigned_To: c.assignedStaffName || "Unassigned",
      Created_At: c.createdAt,
      Deadline: c.deadline
    }));
    exportToCSV("EcoSort_Complaints_Export", rows);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <FileText size={24} color="#1b5e20" />
            <span>Complaint Management</span>
          </h1>
          <p>
            Review, filter, prioritize and assign citizen waste accumulation complaints with AI computer vision audit.
          </p>
        </div>

        <div className="page-actions">
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setNewComplaintModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Log Direct Complaint</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            alignItems: "center"
          }}
        >
          {/* Search Box */}
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              color="#7b9487"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              placeholder="Search ID, area, citizen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: "36px", fontSize: "13px" }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control form-select"
          >
            <option value="ALL">Status: All Complaints</option>
            <option value="Pending">Pending (Unassigned)</option>
            <option value="In-Progress">In-Progress (Dispatched)</option>
            <option value="Resolved">Resolved (Verified)</option>
            <option value="Overdue">Overdue (Breached SLA)</option>
          </select>

          {/* Ward Filter */}
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="form-control form-select"
          >
            <option value="ALL">Ward: All Jurisdictions</option>
            {wards.map((w) => (
              <option key={w.id} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="form-control form-select"
          >
            <option value="ALL">Priority: All Tiers</option>
            <option value="P1">P1 - Immediate (Critical)</option>
            <option value="P2">P2 - High</option>
            <option value="P3">P3 - Standard</option>
            <option value="P4">P4 - Low</option>
          </select>

          {/* AI Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-control form-select"
          >
            <option value="ALL">AI Category: All Types</option>
            <option value="Plastic & Mixed Packaging">Plastic &amp; Mixed Packaging</option>
            <option value="Construction & E-Waste Scrap">Construction &amp; E-Waste</option>
            <option value="Organic & Food Waste">Organic &amp; Food Waste</option>
            <option value="Plastic Bottles & Cans">Plastic Bottles &amp; Cans</option>
            <option value="Cardboard & Packaging Boxes">Cardboard &amp; Packaging</option>
            <option value="Chemical Drums & Industrial Sludge">Hazardous Industrial Waste</option>
          </select>
        </div>

        {/* Results Counter & Quick Reset */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            color: "#6b8075",
            paddingTop: "6px"
          }}
        >
          <span>
            Showing <strong>{filteredList.length}</strong> of {complaints.length} complaints matching filters
          </span>

          {(statusFilter !== "ALL" || wardFilter !== "ALL" || priorityFilter !== "ALL" || categoryFilter !== "ALL" || search) && (
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setWardFilter("ALL");
                setPriorityFilter("ALL");
                setCategoryFilter("ALL");
                setSearch("");
              }}
              style={{ color: "#1b5e20", fontWeight: "700", textDecoration: "underline" }}
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Complaints Master Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-container" style={{ border: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Citizen &amp; Contact</th>
                <th>Area &amp; Ward</th>
                <th>AI Classification</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Staff</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#7b9487" }}>
                    No complaints found matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredList.map((c) => (
                  <tr key={c.id}>
                    {/* Complaint ID */}
                    <td>
                      <Link
                        to={`/complaints/${c.id}`}
                        style={{
                          fontWeight: "800",
                          color: "#1b5e20",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <span>{c.id}</span>
                        <Eye size={13} color="#2e7d32" />
                      </Link>
                      <div style={{ fontSize: "11px", color: "#7b9487", marginTop: "2px" }}>
                        {new Date(c.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })} •{" "}
                        {c.reportsCount} reports
                      </div>
                    </td>

                    {/* Citizen Info */}
                    <td>
                      <div style={{ fontWeight: "700", color: "#132a1e" }}>{c.citizenName}</div>
                      <div style={{ fontSize: "11px", color: "#5a7567" }}>{c.citizenPhone}</div>
                    </td>

                    {/* Area & Ward */}
                    <td>
                      <div style={{ fontWeight: "700", color: "#132a1e" }}>{c.areaName}</div>
                      <div style={{ fontSize: "11.5px", color: "#5a7567" }}>{c.ward}</div>
                    </td>

                    {/* AI Classification & Confidence */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#2563eb" }}>
                          {c.aiCategory}
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#7b9487", marginTop: "2px" }}>
                        AI Confidence: <strong>{c.aiConfidence}%</strong>
                      </div>
                    </td>

                    {/* Priority Badge with click to change */}
                    <td>
                      <button
                        onClick={() => handleOpenPriority(c)}
                        title="Click to adjust priority"
                        style={{ padding: 0 }}
                      >
                        <PriorityBadge priority={c.priority} />
                      </button>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <StatusBadge status={c.status} />
                    </td>

                    {/* Assigned Staff */}
                    <td>
                      {c.assignedStaffName ? (
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "12.5px", color: "#1b5e20" }}>
                            {c.assignedStaffName}
                          </div>
                          <div style={{ fontSize: "11px", color: "#5a7567" }}>
                            {c.assignedTeam || "Rapid Response"}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenAssign(c)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            borderColor: "#fecaca",
                            color: "#dc2626",
                            backgroundColor: "#fef2f2",
                            padding: "3px 8px",
                            fontSize: "11px"
                          }}
                        >
                          + Assign Staff
                        </button>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Link
                          to={`/complaints/${c.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: "5px 10px", fontSize: "12px" }}
                        >
                          Details
                        </Link>

                        <button
                          onClick={() => handleOpenAssign(c)}
                          className="btn btn-secondary btn-sm"
                          title="Assign or re-dispatch"
                          style={{ padding: "5px 8px" }}
                        >
                          <Users size={14} />
                        </button>

                        {c.status !== "Resolved" && (
                          <button
                            onClick={() => updateComplaintStatus(c.id, "Resolved", "Marked resolved by municipal dispatcher.")}
                            className="btn btn-secondary btn-sm"
                            title="Mark as Resolved"
                            style={{ padding: "5px 8px", color: "#16a34a", borderColor: "#bbf7d0" }}
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================
          ASSIGN COMPLAINT MODAL
          ============================================================ */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Complaint: ${selectedComplaint?.id}`}
        icon={Users}
        footer={
          <>
            <button onClick={() => setAssignModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleConfirmAssign} className="btn btn-primary">
              Confirm Assignment &amp; Dispatch
            </button>
          </>
        }
      >
        {selectedComplaint && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                background: "#f4f8f5",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)"
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#132a1e" }}>
                {selectedComplaint.areaName} ({selectedComplaint.ward})
              </div>
              <div style={{ fontSize: "12px", color: "#5a7567", marginTop: "2px" }}>
                AI Category: <strong>{selectedComplaint.aiCategory}</strong> • Priority: <strong>{selectedComplaint.priority}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Staff Member / Squad *</label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="form-control form-select"
              >
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.role} ({s.ward}) [Active Tasks: {s.activeTasks}]
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SLA Resolution Deadline *</label>
              <input
                type="datetime-local"
                value={deadlineInput}
                onChange={(e) => setDeadlineInput(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dispatcher Notes / Field Instructions</label>
              <textarea
                rows="3"
                placeholder="e.g. Ensure compactor crane is ready for bulk plastic bundles. Coordinate with market gate security."
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================
          PRIORITIZE MODAL
          ============================================================ */}
      <Modal
        isOpen={priorityModalOpen}
        onClose={() => setPriorityModalOpen(false)}
        title={`Adjust Priority: ${selectedComplaint?.id}`}
        icon={AlertTriangle}
        footer={
          <>
            <button onClick={() => setPriorityModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleConfirmPriority} className="btn btn-primary">
              Update Priority
            </button>
          </>
        }
      >
        {selectedComplaint && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "13px", color: "#4a6356" }}>
              Set response priority tier to trigger automated supervisor alerting and SLA timers.
            </p>

            <div className="form-group">
              <label className="form-label">Priority Tier</label>
              <select
                value={newPriorityValue}
                onChange={(e) => setNewPriorityValue(e.target.value)}
                className="form-control form-select"
              >
                <option value="P1 - Immediate">P1 - Immediate (Critical Hazard / Hotspot - 4 hr SLA)</option>
                <option value="P2 - High">P2 - High Priority (Public Obstruction - 12 hr SLA)</option>
                <option value="P3 - Standard">P3 - Standard Accumulation (24 hr SLA)</option>
                <option value="P4 - Low">P4 - Low / Minor Litter (48 hr SLA)</option>
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================
          LOG DIRECT COMPLAINT MODAL
          ============================================================ */}
      <Modal
        isOpen={newComplaintModalOpen}
        onClose={() => setNewComplaintModalOpen(false)}
        title="Log Direct Municipal Complaint"
        icon={Plus}
        maxWidth="680px"
        footer={
          <>
            <button onClick={() => setNewComplaintModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreateComplaint} className="btn btn-primary">
              Submit &amp; Create Ticket
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateComplaint} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Area / Landmark Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ring Road Bus Stand Grating"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Municipal Ward *</label>
              <select
                value={newWard}
                onChange={(e) => setNewWard(e.target.value)}
                className="form-control form-select"
              >
                {wards.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Waste Category *</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="form-control form-select"
              >
                <option value="Plastic & Mixed Packaging">Plastic &amp; Mixed Packaging</option>
                <option value="Construction & E-Waste Scrap">Construction &amp; E-Waste Scrap</option>
                <option value="Organic & Food Waste">Organic &amp; Food Waste</option>
                <option value="Plastic Bottles & Cans">Plastic Bottles &amp; Cans</option>
                <option value="Cardboard & Packaging Boxes">Cardboard &amp; Packaging Boxes</option>
                <option value="Chemical Drums & Industrial Sludge">Hazardous Chemical Effluent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level *</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="form-control form-select"
              >
                <option value="P1 - Immediate">P1 - Immediate (Critical Hotspot)</option>
                <option value="P2 - High">P2 - High</option>
                <option value="P3 - Standard">P3 - Standard</option>
                <option value="P4 - Low">P4 - Low</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Citizen / Caller Name</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Chandra"
                value={newCitizenName}
                onChange={(e) => setNewCitizenName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                placeholder="e.g. +91 98765 43210"
                value={newCitizenPhone}
                onChange={(e) => setNewCitizenPhone(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description / Citizen Notes</label>
            <textarea
              rows="3"
              placeholder="Provide exact landmarks, volume estimation, and access constraints..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="form-control"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
