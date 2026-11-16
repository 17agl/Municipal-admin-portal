import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMunicipal } from "../context/MunicipalContext";
import Modal from "../components/common/Modal";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Truck,
  Award,
  CheckCircle,
  X,
  Clock,
  Shield
} from "../components/common/Icons";

export default function StaffManagement() {
  const { staff, wards, vehicles, addStaff, updateStaff, deleteStaff } = useMunicipal();

  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("Rapid Response Driver");
  const [designation, setDesignation] = useState("Heavy Vehicle Operator");
  const [team, setTeam] = useState("Zone 1 Quick Clean");
  const [ward, setWard] = useState(wards[0]?.name || "Ward 1 - Central Market & Bazaar");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [shift, setShift] = useState("Morning (06:00 - 14:00)");
  const [vehicleAssigned, setVehicleAssigned] = useState("DL-1GB-4091 (Compactor)");

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchSearch =
        !search.trim() ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase()) ||
        s.team.toLowerCase().includes(search.toLowerCase());

      const matchWard = wardFilter === "ALL" || s.ward === wardFilter;
      const matchStatus = statusFilter === "ALL" || s.status === statusFilter;

      return matchSearch && matchWard && matchStatus;
    });
  }, [staff, search, wardFilter, statusFilter]);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setName("");
    setRole("Rapid Response Driver");
    setDesignation("Heavy Vehicle Operator");
    setTeam("Zone 1 Quick Clean");
    setWard(wards[0]?.name || "Ward 1 - Central Market & Bazaar");
    setPhone("+91 ");
    setEmail("");
    setShift("Morning (06:00 - 14:00)");
    setVehicleAssigned(vehicles[0]?.plateNumber || "DL-1GB-4091 (Compactor)");
    setModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingStaff(member);
    setName(member.name);
    setRole(member.role);
    setDesignation(member.designation);
    setTeam(member.team);
    setWard(member.ward);
    setPhone(member.phone);
    setEmail(member.email);
    setShift(member.shift);
    setVehicleAssigned(member.vehicleAssigned);
    setModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        name,
        role,
        designation,
        team,
        ward,
        phone,
        email,
        shift,
        vehicleAssigned
      });
    } else {
      addStaff({
        name,
        role,
        designation,
        team,
        ward,
        phone,
        email,
        shift,
        vehicleAssigned
      });
    }

    setModalOpen(false);
  };

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "On Leave" : "Active";
    updateStaff(id, { status: nextStatus });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Users size={24} color="#1b5e20" />
            <span>Staff &amp; Field Workforce Management</span>
          </h1>
          <p>
            Manage municipal sanitation officers, rapid response drivers, team rosters, and ward assignments.
          </p>
        </div>

        <div className="page-actions">
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} />
            <span>Add New Staff Officer</span>
          </button>
        </div>
      </div>

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
            placeholder="Search staff name, role, team..."
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
          <option value="ALL">All Duty Statuses</option>
          <option value="Active">Active On Duty</option>
          <option value="On Leave">On Leave</option>
          <option value="Off Duty">Off Duty</option>
        </select>
      </div>

      {/* Staff Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "20px"
        }}
      >
        {filteredStaff.map((member) => {
          const isActive = member.status === "Active";

          return (
            <div
              key={member.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px",
                position: "relative",
                borderTop: isActive ? "3px solid #16a34a" : "3px solid #94a3b8"
              }}
            >
              <div>
                {/* Top Profile Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "14px",
                        objectFit: "cover",
                        border: "2px solid #ffffff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                      }}
                    />
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "800", color: "#132a1e" }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "#1b5e20" }}>
                        {member.role}
                      </div>
                      <div style={{ fontSize: "11px", color: "#6b8075" }}>
                        {member.designation} • ID: {member.id}
                      </div>
                    </div>
                  </div>

                  <span
                    onClick={() => handleToggleStatus(member.id, member.status)}
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "3px 8px",
                      borderRadius: "999px",
                      cursor: "pointer",
                      backgroundColor: isActive ? "#dcfce7" : "#f1f5f9",
                      color: isActive ? "#166534" : "#475569",
                      border: isActive ? "1px solid #bbf7d0" : "1px solid #cbd5e1"
                    }}
                    title="Click to toggle status"
                  >
                    {member.status}
                  </span>
                </div>

                {/* Info List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "16px",
                    paddingTop: "14px",
                    borderTop: "1px solid var(--border-subtle)",
                    fontSize: "12.5px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4a6356" }}>
                    <Shield size={14} color="#1b5e20" />
                    <span><strong>Ward:</strong> {member.ward}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4a6356" }}>
                    <Truck size={14} color="#2563eb" />
                    <span><strong>Assigned:</strong> {member.vehicleAssigned || "Unassigned"}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4a6356" }}>
                    <Clock size={14} color="#7c3aed" />
                    <span><strong>Shift:</strong> {member.shift}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4a6356" }}>
                    <Phone size={14} color="#1b5e20" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                {/* Performance Pill row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "8px",
                    marginTop: "14px",
                    padding: "10px",
                    background: "#f8faf8",
                    borderRadius: "var(--radius-md)",
                    textAlign: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "10.5px", color: "#6b8075", fontWeight: "700" }}>ACTIVE</div>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: "#2563eb" }}>{member.activeTasks}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10.5px", color: "#6b8075", fontWeight: "700" }}>TODAY</div>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: "#16a34a" }}>{member.completedToday}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10.5px", color: "#6b8075", fontWeight: "700" }}>RATING</div>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: "#d97706" }}>⭐ {member.rating}</div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "16px",
                  paddingTop: "14px",
                  borderTop: "1px solid var(--border-subtle)"
                }}
              >
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  Edit Profile
                </button>
                <Link
                  to="/tasks"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  Assign Task
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================
          ADD / EDIT STAFF MODAL
          ============================================================ */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStaff ? `Edit Officer: ${editingStaff.name}` : "Register New Municipal Staff"}
        icon={Users}
        maxWidth="640px"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSubmitForm} className="btn btn-primary">
              {editingStaff ? "Save Updates" : "Create Staff Profile"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitForm} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Operational Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-control form-select"
              >
                <option value="Rapid Response Driver">Rapid Response Driver</option>
                <option value="Sanitation Supervisor">Sanitation Supervisor</option>
                <option value="E-Waste & Hazardous Specialist">Hazardous Waste Specialist</option>
                <option value="Area Health Officer">Area Health Officer</option>
                <option value="Smart Bin Field Technician">Smart Bin Field Tech</option>
                <option value="Tipper Driver">Tipper Driver</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Designation / Rank</label>
              <input
                type="text"
                placeholder="e.g. Heavy Vehicle Operator"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Squad / Team</label>
              <input
                type="text"
                placeholder="e.g. Zone 1 Quick Clean"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Municipal Ward Jurisdiction *</label>
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
              <label className="form-label">Shift Timing</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="form-control form-select"
              >
                <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                <option value="General (09:00 - 17:00)">General (09:00 - 17:00)</option>
                <option value="Afternoon (14:00 - 22:00)">Afternoon (14:00 - 22:00)</option>
                <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Phone Contact *</label>
              <input
                type="text"
                required
                placeholder="+91 98112 34567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                placeholder="officer@municipal.ecosort.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Vehicle Fleet Unit</label>
            <select
              value={vehicleAssigned}
              onChange={(e) => setVehicleAssigned(e.target.value)}
              className="form-control form-select"
            >
              <option value="Unassigned">No Vehicle (Pedestrian Patrol / Base)</option>
              {vehicles.map((v) => (
                <option key={v.id} value={`${v.plateNumber} (${v.type})`}>
                  {v.plateNumber} — {v.model} ({v.type})
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
