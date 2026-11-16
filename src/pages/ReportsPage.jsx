import { useState } from "react";
import { useMunicipal } from "../context/MunicipalContext";
import {
  generateDailyReport,
  generateCollectionsReport,
  generateWardPerformanceReport,
  exportToCSV,
  triggerPrintReport
} from "../services/reportGenerator";
import {
  Download,
  FileText,
  Calendar,
  CheckCircle,
  Shield,
  Truck,
  Trash2,
  Clock
} from "../components/common/Icons";

export default function ReportsPage() {
  const { complaints, collections, wards, smartBins, vehicles, metrics } = useMunicipal();

  const [dateRange, setDateRange] = useState("TODAY");
  const [downloadSuccess, setDownloadSuccess] = useState("");

  const handleDownloadReport = (type) => {
    if (type === "daily") {
      generateDailyReport(complaints, collections, smartBins, wards);
      setDownloadSuccess("Daily Complaints & Resolution Audit CSV generated successfully.");
    } else if (type === "collections") {
      generateCollectionsReport(collections);
      setDownloadSuccess("Weighbridge Waste Tonnage Audit CSV generated successfully.");
    } else if (type === "wards") {
      generateWardPerformanceReport(wards);
      setDownloadSuccess("Weekly Ward Performance Audit CSV generated successfully.");
    } else if (type === "bins") {
      const rows = smartBins.map((b) => ({
        Bin_Code: b.code,
        Location: b.location,
        Ward: b.ward,
        Fill_Level_Pct: b.fillLevel,
        Category: b.category,
        Battery_Pct: b.batteryLevel,
        Sensor_Status: b.sensorStatus,
        Last_Emptied: b.lastEmptied
      }));
      exportToCSV("EcoSort_Smart_Bin_Telemetry_Report", rows);
      setDownloadSuccess("IoT Smart Bin Telemetry Report CSV generated successfully.");
    }

    setTimeout(() => setDownloadSuccess(""), 4000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Download size={24} color="#1b5e20" />
            <span>Municipal Reports &amp; Compliance Audits</span>
          </h1>
          <p>
            Generate and export official daily, weekly, and monthly municipal performance reports, weighbridge tickets, and regulatory audit archives.
          </p>
        </div>

        <div className="page-actions">
          <button onClick={triggerPrintReport} className="btn btn-secondary">
            <span>🖨️ Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
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
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Report Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "20px"
        }}
      >
        {/* Report 1: Daily Complaints Audit */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#e8f5e9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1b5e20"
                }}
              >
                <FileText size={18} />
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#132a1e" }}>
                  Daily Complaints &amp; Resolution Audit
                </div>
                <div style={{ fontSize: "11px", color: "#6b8075", textTransform: "uppercase", fontWeight: "700" }}>
                  Daily Schedule • Official Log
                </div>
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "#4a6356", lineHeight: 1.5 }}>
              Comprehensive log of all citizen garbage reports, AI classification confidence, response turnaround, assigned squads, and closure status.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
            <span style={{ fontSize: "12px", color: "#7b9487" }}>
              {complaints.length} Records today
            </span>
            <button onClick={() => handleDownloadReport("daily")} className="btn btn-primary btn-sm">
              <Download size={14} />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Report 2: Weekly Ward Performance Audit */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563eb"
                }}
              >
                <Shield size={18} />
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#132a1e" }}>
                  Weekly Ward SLA Performance Audit
                </div>
                <div style={{ fontSize: "11px", color: "#6b8075", textTransform: "uppercase", fontWeight: "700" }}>
                  Weekly Schedule • Supervisor Ranking
                </div>
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "#4a6356", lineHeight: 1.5 }}>
              Aggregated ward-wise resolution benchmarks, supervisor compliance scores, active field workforce counts, and average clearance times.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
            <span style={{ fontSize: "12px", color: "#7b9487" }}>
              {wards.length} Municipal Wards
            </span>
            <button onClick={() => handleDownloadReport("wards")} className="btn btn-primary btn-sm">
              <Download size={14} />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Report 3: Monthly Collection & Landfill Diversion */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#fef3c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#d97706"
                }}
              >
                <Truck size={18} />
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#132a1e" }}>
                  Weighbridge Waste Tonnage Audit
                </div>
                <div style={{ fontSize: "11px", color: "#6b8075", textTransform: "uppercase", fontWeight: "700" }}>
                  Monthly Audit • MRF Verification
                </div>
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "#4a6356", lineHeight: 1.5 }}>
              Net waste tonnage slips, vehicle gross and tare scale logs, certified disposal facilities, and circular economy diversion records.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
            <span style={{ fontSize: "12px", color: "#7b9487" }}>
              {collections.length} Weighbridge slips
            </span>
            <button onClick={() => handleDownloadReport("collections")} className="btn btn-primary btn-sm">
              <Download size={14} />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Report 4: Smart Bin Telemetry */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#dc2626"
                }}
              >
                <Trash2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#132a1e" }}>
                  IoT Smart Bin Hardware Audit
                </div>
                <div style={{ fontSize: "11px", color: "#6b8075", textTransform: "uppercase", fontWeight: "700" }}>
                  Hardware Telematics • Sensor Health
                </div>
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "#4a6356", lineHeight: 1.5 }}>
              Fill level telemetry, ultrasonic transducer readings, lithium battery longevity, and overflow event frequency logs.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
            <span style={{ fontSize: "12px", color: "#7b9487" }}>
              {smartBins.length} Connected Bins
            </span>
            <button onClick={() => handleDownloadReport("bins")} className="btn btn-primary btn-sm">
              <Download size={14} />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Government Print Preview Section */}
      <div
        className="card"
        style={{
          padding: "28px",
          background: "#ffffff",
          border: "2px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)"
        }}
      >
        <div
          style={{
            textAlign: "center",
            paddingBottom: "18px",
            borderBottom: "2px solid #132a1e",
            marginBottom: "20px"
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#1b5e20", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Government of NCT Delhi • Urban Development &amp; Sanitation Division
          </div>
          <div style={{ fontSize: "20px", fontWeight: "800", color: "#132a1e", margin: "4px 0" }}>
            EcoSort AI Municipal Command Executive Audit Summary
          </div>
          <div style={{ fontSize: "12px", color: "#6b8075" }}>
            Generated on: {new Date().toLocaleString()} • Report ID: AUD-2026-MUNI-99
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
          <div>
            <span style={{ fontSize: "11px", color: "#7b9487", textTransform: "uppercase", fontWeight: "700" }}>Total Complaints</span>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#132a1e" }}>{metrics.totalComplaints} Cases</div>
          </div>

          <div>
            <span style={{ fontSize: "11px", color: "#7b9487", textTransform: "uppercase", fontWeight: "700" }}>Resolution Compliance</span>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#16a34a" }}>
              {Math.round((metrics.resolvedComplaints / (metrics.totalComplaints || 1)) * 100)}%
            </div>
          </div>

          <div>
            <span style={{ fontSize: "11px", color: "#7b9487", textTransform: "uppercase", fontWeight: "700" }}>Overdue Breaches</span>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#dc2626" }}>{metrics.overdueComplaints} Breached</div>
          </div>

          <div>
            <span style={{ fontSize: "11px", color: "#7b9487", textTransform: "uppercase", fontWeight: "700" }}>Net Waste Cleared</span>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#1b5e20" }}>
              {(metrics.totalWasteCollectedKg / 1000).toFixed(2)} Tons
            </div>
          </div>
        </div>

        <div style={{ fontSize: "11.5px", color: "#6b8075", textAlign: "right" }}>
          Authorized Signature: <strong>Dr. Alok Verma, IAS (Municipal Commissioner)</strong>
        </div>
      </div>
    </div>
  );
}
