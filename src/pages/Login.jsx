import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Lock, Mail, CheckCircle } from "../components/common/Icons";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("commissioner@municipal.ecosort.gov.in");
  const [password, setPassword] = useState("••••••••••••");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate("/");
  };

  const handleQuickDemoLogin = (roleEmail) => {
    setEmail(roleEmail);
    login(roleEmail, "demo123");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f7f5",
        padding: "20px"
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: "460px",
          width: "100%",
          padding: "36px 32px",
          boxShadow: "var(--shadow-lg)",
          borderRadius: "var(--radius-xl)"
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #1b5e20, #2e7d32)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              boxShadow: "0 6px 16px rgba(27, 94, 32, 0.25)"
            }}
          >
            <Shield size={28} />
          </div>

          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#132a1e" }}>
            EcoSort<span style={{ color: "#2e7d32" }}>AI</span> Municipal
          </h1>
          <p style={{ fontSize: "13px", color: "#6b8075", marginTop: "4px" }}>
            Urban Sanitation &amp; Municipal Command Authority
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Official Municipal ID / Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Security Access PIN / Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", marginTop: "6px" }}
          >
            Secure Administrative Sign In
          </button>
        </form>

        {/* Quick Demo Access Credentials */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border-subtle)"
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#8fa599", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center", marginBottom: "10px" }}>
            One-Click Authorized Demo Access
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={() => handleQuickDemoLogin("commissioner@municipal.ecosort.gov.in")}
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <span>🏛️ Login as Municipal Commissioner (Full Access)</span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin("r.kulkarni@ward1.ecosort.gov.in")}
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <span>📍 Login as Ward 1 Area Supervisor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
