// Report Generator Engine - CSV & Printable Document Exporter

export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const separator = ",";
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    "\n" +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateDailyReport(complaints, collections, smartBins, wardStats) {
  const dateStr = new Date().toISOString().split("T")[0];
  const rows = complaints.map((c) => ({
    Complaint_ID: c.id,
    Citizen_Name: c.citizenName,
    Citizen_Phone: c.citizenPhone,
    Ward: c.ward,
    Area: c.areaName,
    AI_Category: c.aiCategory,
    AI_Confidence_Pct: c.aiConfidence,
    Severity: c.severity,
    Priority: c.priority,
    Status: c.status,
    Assigned_Staff: c.assignedStaffName || "Unassigned",
    Created_At: c.createdAt,
    Deadline: c.deadline
  }));
  exportToCSV(`EcoSort_Municipal_Daily_Complaints_${dateStr}`, rows);
}

export function generateCollectionsReport(collections) {
  const dateStr = new Date().toISOString().split("T")[0];
  const rows = collections.map((col) => ({
    Collection_ID: col.id,
    Ticket_Number: col.ticketNo,
    Date: col.date,
    Time: col.time,
    Vehicle_Plate: col.vehicleNumber,
    Vehicle_Type: col.vehicleType,
    Driver_Name: col.driverName,
    Ward: col.ward,
    Waste_Category: col.wasteCategory,
    Net_Weight_Kg: col.netWasteKg,
    Disposal_Facility: col.destinationFacility,
    Status: col.status
  }));
  exportToCSV(`EcoSort_Municipal_Waste_Collections_${dateStr}`, rows);
}

export function generateWardPerformanceReport(wards) {
  const dateStr = new Date().toISOString().split("T")[0];
  const rows = wards.map((w) => ({
    Ward_Code: w.code,
    Ward_Name: w.name,
    Supervisor: w.supervisor,
    Supervisor_Phone: w.supervisorPhone,
    Total_Complaints: w.totalComplaints,
    Resolved_Complaints: w.resolvedComplaints,
    Resolution_Rate_Pct: w.resolutionRate,
    Avg_Resolution_Hours: w.avgResolutionHours,
    Active_Staff_Count: w.activeStaff,
    Smart_Bins_Total: w.smartBinsCount,
    Overflowing_Bins: w.overflowingBins,
    Daily_Waste_Target_Tons: w.dailyWasteTargetTons,
    Daily_Waste_Collected_Tons: w.dailyWasteCollectedTons
  }));
  exportToCSV(`EcoSort_Municipal_Ward_Performance_${dateStr}`, rows);
}

export function triggerPrintReport() {
  window.print();
}
