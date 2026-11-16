import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMunicipal } from "../context/MunicipalContext";
import { StatusBadge, PriorityBadge, SeverityBadge } from "../components/common/Badge";
import Modal from "../components/common/Modal";
import {
  FileText,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Truck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail
} from "../components/common/Icons";

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    complaints,
    staff,
    updateComplaintStatus,
    assignComplaint,
    prioritizeComplaint
  } = useMunicipal();

  const complaint = complaints.find((c) => c.id === id);

  // Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [dispatchNotes, setDispatchNotes] = useState("");

  // Status Change Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState("Resolved");
  const [statusNotes, setStatusNotes] = useState("");

  if (!complaint) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
        <AlertTriangle size={36} color="#dc2626" style={{ margin: "0 auto 12px" }} />
        <h2>Complaint Not Found</h2>
        <p style={{ color: "#5a7567", marginTop: "6px" }}>
          The requested ticket #{id} could not be located in the municipal database.
        </p>
        <Link to="/complaints" className="btn btn-primary" style={{ marginTop: "20px" }}>
          Back to Complaints List
        </Link>
      </div>
    );
  }

  const handleOpenAssign = () => {
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
    if (!selectedStaffId) return;
    assignComplaint(
      complaint.id,
      selectedStaffId,
      new Date(deadlineInput).toISOString(),
      dispatchNotes
    );
    setAssignModalOpen(false);
  };

  const handleConfirmStatus = () => {
    updateComplaintStatus(complaint.id, targetStatus, statusNotes);
    setStatusModalOpen(false);
    setStatusNotes("");
  };

  // Check if overdue
  const isOverdue =
    complaint.status !== "Resolved" &&
    new Date(complaint.deadline).getTime() < Date.now();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#5a7567" }}>
        <Link to="/complaints" style={{ color: "#1b5e20", fontWeight: "600" }}>
          Complaint Management
        </Link>
        <ChevronRight size={14} />
        <span style={{ fontWeight: "700", color: "#132a1e" }}>{complaint.id}</span>
      </div>

      {/* Header Banner */}
      <div
        className="card"
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#132a1e", letterSpacing: "-0.02em" }}>
              {complaint.areaName}
            </h1>
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
            <SeverityBadge severity={complaint.severity} />
          </div>

          <p style={{ fontSize: "13.5px", color: "#4a6356", marginTop: "6px" }}>
            Ticket <strong>#{complaint.id}</strong> • Jurisdiction: <strong>{complaint.ward}</strong> • Reported:{" "}
            {new Date(complaint.createdAt).toLocaleString()}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={handleOpenAssign} className="btn btn-secondary">
            <Users size={16} />
            <span>{complaint.assignedStaffName ? "Re-assign Squad" : "Assign to Squad"}</span>
          </button>

          {complaint.status !== "Resolved" ? (
            <button
              onClick={() => {
                setTargetStatus("Resolved");
                setStatusModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <CheckCircle size={16} />
              <span>Mark as Resolved</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setTargetStatus("In-Progress");
                setStatusModalOpen(true);
              }}
              className="btn btn-secondary"
            >
              <span>Reopen Ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "24px" }}>
        {/* Left Column: Citizen Image + AI Analysis + Citizen Contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Citizen Photo & AI Vision Detection Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Sparkles size={18} color="#7c3aed" />
                <span>Citizen Evidence Photo &amp; AI Analysis</span>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  background: "#f5f3ff",
                  color: "#7c3aed",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid #ddd6fe"
                }}
              >
                YOLOv11 Vision Verified
              </span>
            </div>

            {/* Photo preview with AI bounding overlay badge */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "280px",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "#000000"
              }}
            >
              <img
                src={complaint.imageUrl}
                alt="Citizen Evidence"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.95
                }}
              />

              {/* Floating AI Tag */}
              <div
                style={{
                  position: "absolute",
                  bottom: "14px",
                  left: "14px",
                  background: "rgba(19, 42, 30, 0.88)",
                  backdropFilter: "blur(6px)",
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
                <div>
                  <div style={{ fontWeight: "800", color: "#a7f3d0" }}>{complaint.aiCategory}</div>
                  <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                    Confidence: {complaint.aiConfidence}% • Severity: {complaint.severity}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Reasoning Details */}
            <div
              style={{
                marginTop: "16px",
                padding: "14px",
                backgroundColor: "#f9fcf9",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)"
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#1b5e20", textTransform: "uppercase" }}>
                AI Model Detection Insights
              </div>
              <p style={{ fontSize: "13px", color: "#2e4d3a", marginTop: "4px", lineHeight: "1.5" }}>
                {complaint.aiReasoning}
              </p>
            </div>
          </div>

          {/* Citizen Details Card */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: "14px" }}>
              <Users size={18} color="#1b5e20" />
              <span>Citizen Submitter Information</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "13px" }}>
              <div>
                <span style={{ color: "#7b9487", fontSize: "11.5px", fontWeight: "700", textTransform: "uppercase" }}>
                  Citizen Name
                </span>
                <div style={{ fontWeight: "700", color: "#132a1e", marginTop: "2px" }}>
                  {complaint.citizenName}
                </div>
              </div>

              <div>
                <span style={{ color: "#7b9487", fontSize: "11.5px", fontWeight: "700", textTransform: "uppercase" }}>
                  Community Sightings
                </span>
                <div style={{ fontWeight: "700", color: "#dc2626", marginTop: "2px" }}>
                  {complaint.reportsCount} citizen logs
                </div>
              </div>

              <div>
                <span style={{ color: "#7b9487", fontSize: "11.5px", fontWeight: "700", textTransform: "uppercase" }}>
                  Phone
                </span>
                <div style={{ color: "#1b5e20", fontWeight: "600", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Phone size={12} />
                  <span>{complaint.citizenPhone}</span>
                </div>
              </div>

              <div>
                <span style={{ color: "#7b9487", fontSize: "11.5px", fontWeight: "700", textTransform: "uppercase" }}>
                  Email
                </span>
                <div style={{ color: "#1b5e20", fontWeight: "600", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Mail size={12} />
                  <span>{complaint.citizenEmail || "Not provided"}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
              <span style={{ color: "#7b9487", fontSize: "11.5px", fontWeight: "700", textTransform: "uppercase" }}>
                Citizen Notes
              </span>
              <p style={{ fontSize: "13px", color: "#374f42", marginTop: "4px", fontStyle: "italic" }}>
                "{complaint.citizenNotes || "No additional comments provided."}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Location, Assignment & Audit History */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Location & GPS Info */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <MapPin size={18} color="#1b5e20" />
                <span>Geographic &amp; Ward Coordinates</span>
              </div>
              <a
                href={`https://www.google.com/maps?q=${complaint.lat},${complaint.lng}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <span>Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <div style={{ background: "#f8faf8", padding: "12px", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontWeight: "800", color: "#132a1e" }}>{complaint.address || complaint.areaName}</div>
                <div style={{ color: "#5a7567", fontSize: "12px", marginTop: "2px" }}>
                  {complaint.ward}
                </div>
                <div style={{ fontSize: "11.5px", fontFamily: "var(--font-mono)", color: "#1b5e20", marginTop: "6px" }}>
                  📍 Lat: {complaint.lat?.toFixed(5)}, Lng: {complaint.lng?.toFixed(5)}
                </div>
              </div>

              {/* SLA Target Box */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  background: isOverdue ? "#fee2e2" : "#f0fdf4",
                  border: isOverdue ? "1px solid #fecaca" : "1px solid #bbf7d0"
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "800", color: isOverdue ? "#991b1b" : "#166534" }}>
                    {isOverdue ? "⚠️ SLA RESPONSE BREACHED" : "⏱️ RESOLUTION SLA TARGET"}
                  </div>
                  <div style={{ fontSize: "11.5px", color: isOverdue ? "#b91c1c" : "#15803d", marginTop: "2px" }}>
                    Deadline: {new Date(complaint.deadline).toLocaleString()}
                  </div>
                </div>

                <div style={{ fontWeight: "800", fontSize: "14px", color: isOverdue ? "#dc2626" : "#16a34a" }}>
                  {isOverdue ? "OVERDUE" : "ON TRACK"}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Squad Info */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Truck size={18} color="#1b5e20" />
                <span>Field Dispatch &amp; Squad Assignment</span>
              </div>
              <button onClick={handleOpenAssign} className="btn btn-secondary btn-sm">
                Change
              </button>
            </div>

            {complaint.assignedStaffName ? (
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "#e8f5e9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1b5e20"
                  }}
                >
                  <Users size={24} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#132a1e" }}>
                    {complaint.assignedStaffName}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#4a6356" }}>
                    {complaint.assignedTeam || "Municipal Sanitation Squad"}
                  </div>
                  {complaint.assignedVehicle && (
                    <div style={{ fontSize: "11.5px", color: "#1b5e20", fontWeight: "700", marginTop: "2px" }}>
                      Vehicle: {complaint.assignedVehicle}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "16px", color: "#dc2626" }}>
                <AlertTriangle size={24} style={{ margin: "0 auto 6px" }} />
                <div style={{ fontWeight: "700" }}>No Staff Assigned Yet</div>
                <div style={{ fontSize: "12px", color: "#7b9487", marginTop: "2px" }}>
                  Assign a field driver or supervisor to begin clearance.
                </div>
                <button onClick={handleOpenAssign} className="btn btn-primary btn-sm" style={{ marginTop: "12px" }}>
                  Assign Now
                </button>
              </div>
            )}

            {complaint.resolutionNotes && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "10px 12px",
                  backgroundColor: "#f0fdf4",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #bbf7d0",
                  fontSize: "12.5px",
                  color: "#166534"
                }}
              >
                <strong>Resolution Log:</strong> {complaint.resolutionNotes}
              </div>
            )}
          </div>

          {/* Timeline History */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: "16px" }}>
              <Clock size={18} color="#1b5e20" />
              <span>Full Audit Timeline &amp; History</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
              {complaint.history.map((h, idx) => (
                <div
                  key={h.id || idx}
                  style={{
                    display: "flex",
                    gap: "12px",
                    position: "relative",
                    paddingBottom: idx === complaint.history.length - 1 ? 0 : "12px",
                    borderBottom: idx === complaint.history.length - 1 ? "none" : "1px dashed var(--border-subtle)"
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: idx === complaint.history.length - 1 ? "#16a34a" : "#2e7d32",
                      marginTop: "6px",
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: "#132a1e" }}>
                      {h.action}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#5a7567", marginTop: "2px" }}>
                      {h.actor} • {h.timestamp}
                    </div>
                    {h.notes && (
                      <div style={{ fontSize: "12px", color: "#2d4438", marginTop: "4px" }}>
                        {h.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          ASSIGN MODAL
          ============================================================ */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Complaint: ${complaint.id}`}
        icon={Users}
        footer={
          <>
            <button onClick={() => setAssignModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleConfirmAssign} className="btn btn-primary">
              Confirm &amp; Dispatch
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="form-group">
            <label className="form-label">Select Staff Member *</label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="form-control form-select"
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.role} ({s.ward})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Deadline *</label>
            <input
              type="datetime-local"
              value={deadlineInput}
              onChange={(e) => setDeadlineInput(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Instructions / Dispatch Notes</label>
            <textarea
              rows="3"
              value={dispatchNotes}
              onChange={(e) => setDispatchNotes(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </Modal>

      {/* ============================================================
          STATUS CHANGE MODAL
          ============================================================ */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Complaint Status: ${complaint.id}`}
        icon={CheckCircle}
        footer={
          <>
            <button onClick={() => setStatusModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleConfirmStatus} className="btn btn-primary">
              Save Status
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="form-group">
            <label className="form-label">Target Status *</label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value)}
              className="form-control form-select"
            >
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Verification / Closure Notes</label>
            <textarea
              rows="3"
              placeholder="e.g. Field driver completed site sweep. Disposed 450 kg plastic at MRF. Photo verified."
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
