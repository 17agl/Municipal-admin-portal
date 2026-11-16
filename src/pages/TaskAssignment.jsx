import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMunicipal } from "../context/MunicipalContext";
import { StatusBadge, PriorityBadge } from "../components/common/Badge";
import Modal from "../components/common/Modal";
import {
  CheckSquare,
  Users,
  Clock,
  Truck,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ChevronRight,
  Sparkles
} from "../components/common/Icons";

export default function TaskAssignment() {
  const {
    complaints,
    staff,
    assignComplaint,
    updateComplaintStatus,
    prioritizeComplaint
  } = useMunicipal();

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [notes, setNotes] = useState("");

  // Group complaints by operational status
  const pendingQueue = useMemo(
    () => complaints.filter((c) => c.status === "Pending"),
    [complaints]
  );
  const inProgressQueue = useMemo(
    () => complaints.filter((c) => c.status === "In-Progress"),
    [complaints]
  );
  const overdueQueue = useMemo(
    () => complaints.filter((c) => c.status === "Overdue"),
    [complaints]
  );
  const resolvedQueue = useMemo(
    () => complaints.filter((c) => c.status === "Resolved"),
    [complaints]
  );

  const handleOpenAssign = (c) => {
    setActiveComplaint(c);
    setSelectedStaffId(c.assignedTo || (staff[0]?.id || ""));
    setDeadlineInput(
      c.deadline
        ? new Date(c.deadline).toISOString().slice(0, 16)
        : new Date(Date.now() + 6 * 3600000).toISOString().slice(0, 16)
    );
    setNotes("");
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!activeComplaint || !selectedStaffId) return;
    assignComplaint(
      activeComplaint.id,
      selectedStaffId,
      new Date(deadlineInput).toISOString(),
      notes
    );
    setAssignModalOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <CheckSquare size={24} color="#1b5e20" />
            <span>Task Assignment &amp; Dispatch Board</span>
          </h1>
          <p>
            Allocate citizen waste tickets to active field drivers, set SLA resolution deadlines, and track real-time turnaround.
          </p>
        </div>

        <div className="page-actions">
          <div style={{ fontSize: "12.5px", color: "#4a6356", fontWeight: "600" }}>
            Active Field Staff: <strong style={{ color: "#16a34a" }}>{staff.filter((s) => s.status === "Active").length} On Duty</strong>
          </div>
        </div>
      </div>

      {/* 4-Column Operational Kanban Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "18px",
          alignItems: "start"
        }}
      >
        {/* ============================================================
            COLUMN 1: UNASSIGNED PENDING (NEEDS ACTION)
            ============================================================ */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              background: "#fff7ed",
              borderBottom: "1px solid #ffedd5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={16} color="#ea580c" />
              <span style={{ fontSize: "14px", fontWeight: "800", color: "#9a3412" }}>
                Unassigned Pending
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "800",
                background: "#ffffff",
                color: "#ea580c",
                padding: "2px 8px",
                borderRadius: "999px"
              }}
            >
              {pendingQueue.length}
            </span>
          </div>

          <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "12px", minHeight: "400px" }}>
            {pendingQueue.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 10px", color: "#7b9487", fontSize: "12.5px" }}>
                🎉 All complaints assigned! No pending backlog.
              </div>
            ) : (
              pendingQueue.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    padding: "14px",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#1b5e20" }}>
                      {c.id}
                    </span>
                    <PriorityBadge priority={c.priority} />
                  </div>

                  <div style={{ fontSize: "13.5px", fontWeight: "800", color: "#132a1e" }}>
                    {c.areaName}
                  </div>

                  <div style={{ fontSize: "12px", color: "#5a7567" }}>
                    {c.ward} • {c.aiCategory}
                  </div>

                  <div style={{ fontSize: "11px", color: "#7b9487" }}>
                    Reported: {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>

                  <button
                    onClick={() => handleOpenAssign(c)}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: "4px", width: "100%" }}
                  >
                    <span>+ Assign to Staff</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ============================================================
            COLUMN 2: IN-PROGRESS (TRUCKS EN ROUTE)
            ============================================================ */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              background: "#eff6ff",
              borderBottom: "1px solid #dbeafe",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Truck size={16} color="#2563eb" />
              <span style={{ fontSize: "14px", fontWeight: "800", color: "#1e40af" }}>
                In-Progress Dispatched
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "800",
                background: "#ffffff",
                color: "#2563eb",
                padding: "2px 8px",
                borderRadius: "999px"
              }}
            >
              {inProgressQueue.length}
            </span>
          </div>

          <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "12px", minHeight: "400px" }}>
            {inProgressQueue.map((c) => (
              <div
                key={c.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  padding: "14px",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#2563eb" }}>
                    {c.id}
                  </span>
                  <PriorityBadge priority={c.priority} />
                </div>

                <div style={{ fontSize: "13.5px", fontWeight: "800", color: "#132a1e" }}>
                  {c.areaName}
                </div>

                <div style={{ background: "#f0fdf4", padding: "8px", borderRadius: "6px", fontSize: "11.5px", color: "#166534" }}>
                  <strong>Squad:</strong> {c.assignedStaffName || "Field Crew"} ({c.assignedVehicle || "Compactor"})
                </div>

                <div style={{ fontSize: "11px", color: "#6b8075", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={12} color="#2563eb" />
                  <span>Deadline: {new Date(c.deadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>

                <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                  <button
                    onClick={() => handleOpenAssign(c)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: "11px" }}
                  >
                    Re-assign
                  </button>
                  <button
                    onClick={() => updateComplaintStatus(c.id, "Resolved", "Site swept and verified by dispatch.")}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, fontSize: "11px", backgroundColor: "#16a34a" }}
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            COLUMN 3: OVERDUE SLA BREACHES
            ============================================================ */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              background: "#fef2f2",
              borderBottom: "1px solid #fecaca",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={16} color="#dc2626" />
              <span style={{ fontSize: "14px", fontWeight: "800", color: "#991b1b" }}>
                Overdue Escalations
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "800",
                background: "#ffffff",
                color: "#dc2626",
                padding: "2px 8px",
                borderRadius: "999px"
              }}
            >
              {overdueQueue.length}
            </span>
          </div>

          <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "12px", minHeight: "400px" }}>
            {overdueQueue.map((c) => (
              <div
                key={c.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #fecaca",
                  padding: "14px",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#dc2626" }}>
                    ⚠️ {c.id}
                  </span>
                  <PriorityBadge priority={c.priority} />
                </div>

                <div style={{ fontSize: "13.5px", fontWeight: "800", color: "#132a1e" }}>
                  {c.areaName}
                </div>

                <div style={{ fontSize: "11px", color: "#b91c1c", fontWeight: "700" }}>
                  SLA Breached: {new Date(c.deadline).toLocaleDateString()}
                </div>

                <div style={{ fontSize: "11.5px", color: "#5a7567" }}>
                  Assigned: {c.assignedStaffName || "Unassigned"}
                </div>

                <button
                  onClick={() => handleOpenAssign(c)}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: "4px", borderColor: "#fca5a5", color: "#dc2626" }}
                >
                  Priority Re-assign Squad
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            COLUMN 4: RESOLVED & VERIFIED
            ============================================================ */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              background: "#f0fdf4",
              borderBottom: "1px solid #bbf7d0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle size={16} color="#16a34a" />
              <span style={{ fontSize: "14px", fontWeight: "800", color: "#166534" }}>
                Resolved &amp; Cleared
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "800",
                background: "#ffffff",
                color: "#16a34a",
                padding: "2px 8px",
                borderRadius: "999px"
              }}
            >
              {resolvedQueue.length}
            </span>
          </div>

          <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "12px", minHeight: "400px" }}>
            {resolvedQueue.slice(0, 4).map((c) => (
              <div
                key={c.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  opacity: 0.9
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#16a34a" }}>
                    {c.id}
                  </span>
                  <StatusBadge status="Resolved" />
                </div>

                <div style={{ fontSize: "13px", fontWeight: "700", color: "#132a1e" }}>
                  {c.areaName}
                </div>

                <div style={{ fontSize: "11.5px", color: "#4a6356" }}>
                  Cleared by: {c.assignedStaffName}
                </div>

                {c.resolutionNotes && (
                  <div style={{ fontSize: "11px", color: "#166534", fontStyle: "italic", background: "#f8faf8", padding: "6px 8px", borderRadius: "4px" }}>
                    "{c.resolutionNotes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          ASSIGN MODAL
          ============================================================ */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Task Assignment: ${activeComplaint?.id}`}
        icon={Users}
        footer={
          <>
            <button onClick={() => setAssignModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleConfirmAssign} className="btn btn-primary">
              Confirm &amp; Notify Squad
            </button>
          </>
        }
      >
        {activeComplaint && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ background: "#f8faf8", padding: "12px", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#132a1e" }}>
                {activeComplaint.areaName} ({activeComplaint.ward})
              </div>
              <div style={{ fontSize: "12px", color: "#5a7567", marginTop: "2px" }}>
                Classification: {activeComplaint.aiCategory} • Priority: {activeComplaint.priority}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Assign to Officer / Driver *</label>
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
              <label className="form-label">SLA Deadline *</label>
              <input
                type="datetime-local"
                value={deadlineInput}
                onChange={(e) => setDeadlineInput(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dispatcher Notes</label>
              <textarea
                rows="3"
                placeholder="Include safety warnings, required equipment, or gate access info..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
