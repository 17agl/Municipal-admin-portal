import { useEffect, useRef, useState } from "react";
import { useMunicipal } from "../../context/MunicipalContext";
import { DEFAULT_COORDS } from "../../services/api";
import { StatusBadge, PriorityBadge } from "../common/Badge";
import {
  MapPin,
  Trash2,
  Truck,
  AlertTriangle,
  Layers,
  CheckCircle,
  ExternalLink,
  Shield
} from "../common/Icons";

export default function LiveGarbageMap({
  height = "600px",
  selectedComplaintId = null,
  onSelectComplaint = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    wards: null,
    complaints: null,
    bins: null,
    vehicles: null
  });

  const {
    complaints,
    wards,
    smartBins,
    vehicles,
    updateComplaintStatus,
    emptyBin
  } = useMunicipal();

  // Layer filter toggles
  const [layersVisible, setLayersVisible] = useState({
    wards: true,
    complaints: true,
    hotspots: true,
    smartBins: true,
    vehicles: true
  });

  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeItemPopup, setActiveItemPopup] = useState(null);

  // Initialize Leaflet Map
  useEffect(() => {
    const L = window.L;
    if (!L || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter = [DEFAULT_COORDS.lat, DEFAULT_COORDS.lng];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: DEFAULT_COORDS.zoom,
        zoomControl: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | EcoSort AI Municipal GIS',
        maxZoom: 19
      }).addTo(map);

      // Create Layer Groups
      layersRef.current.wards = L.layerGroup().addTo(map);
      layersRef.current.complaints = L.layerGroup().addTo(map);
      layersRef.current.bins = L.layerGroup().addTo(map);
      layersRef.current.vehicles = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);
    }

    return () => {
      // Cleanup on unmount if necessary
    };
  }, []);

  // Update Map Layers whenever data or layer toggles change
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;

    const {
      wards: wardLayer,
      complaints: cmpLayer,
      bins: binLayer,
      vehicles: vehLayer
    } = layersRef.current;

    // 1. Render Ward Boundaries
    wardLayer.clearLayers();
    if (layersVisible.wards && wards) {
      wards.forEach((w) => {
        if (!w.polygon) return;
        const poly = L.polygon(w.polygon, {
          color: w.color || "#2e7d32",
          weight: 2,
          opacity: 0.8,
          fillColor: w.color || "#2e7d32",
          fillOpacity: 0.12,
          dashArray: "4, 6"
        });

        poly.bindPopup(`
          <div style="padding: 12px; min-width: 200px;">
            <div style="font-size: 11px; font-weight: 700; color: #1b5e20; text-transform: uppercase;">MUNICIPAL JURISDICTION</div>
            <div style="font-size: 14px; font-weight: 800; color: #132a1e; margin: 2px 0 6px;">${w.name}</div>
            <div style="font-size: 12px; color: #4a6356; margin-bottom: 4px;">Supervisor: <strong>${w.supervisor}</strong></div>
            <div style="font-size: 12px; color: #4a6356; margin-bottom: 4px;">Resolution Rate: <strong style="color: #16a34a;">${w.resolutionRate}%</strong></div>
            <div style="font-size: 12px; color: #4a6356;">Active Staff: <strong>${w.activeStaff} officers</strong></div>
          </div>
        `);
        wardLayer.addLayer(poly);
      });
    }

    // 2. Render Complaint & Hotspot Markers
    cmpLayer.clearLayers();
    if (layersVisible.complaints && complaints) {
      complaints.forEach((c) => {
        if (!c.lat || !c.lng) return;

        // Custom icon based on priority/severity
        let pinColor = "#ea580c"; // High / Orange
        if (c.priority?.startsWith("P1") || c.status === "Overdue") pinColor = "#dc2626"; // Red
        else if (c.status === "Resolved") pinColor = "#16a34a"; // Green
        else if (c.status === "In-Progress") pinColor = "#2563eb"; // Blue

        // Pulse circle for Critical / P1 Hotspots
        if (layersVisible.hotspots && (c.priority?.startsWith("P1") || c.reportsCount >= 10)) {
          const circle = L.circle([c.lat, c.lng], {
            radius: 250,
            color: pinColor,
            fillColor: pinColor,
            fillOpacity: 0.2,
            weight: 1
          });
          cmpLayer.addLayer(circle);
        }

        const iconHtml = `
          <div style="
            width: 28px;
            height: 28px;
            background: ${pinColor};
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            color: #ffffff;
            font-size: 12px;
            font-weight: bold;
          ">
            ${c.reportsCount > 1 ? c.reportsCount : "📍"}
          </div>
        `;

        const customMarker = L.marker([c.lat, c.lng], {
          icon: L.divIcon({
            html: iconHtml,
            className: "leaflet-custom-pin",
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          })
        });

        customMarker.on("click", () => {
          if (onSelectComplaint) onSelectComplaint(c);
        });

        customMarker.bindPopup(`
          <div style="padding: 12px; min-width: 240px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 800; color: #1b5e20;">${c.id}</span>
              <span style="font-size: 10px; font-weight: 700; background: ${pinColor}20; color: ${pinColor}; padding: 2px 6px; border-radius: 4px;">
                ${c.priority}
              </span>
            </div>
            <div style="font-size: 14px; font-weight: 800; color: #132a1e; margin-bottom: 4px;">
              ${c.areaName}
            </div>
            <div style="font-size: 12px; color: #4a6356; margin-bottom: 6px;">
              AI Category: <strong>${c.aiCategory}</strong> (${c.aiConfidence}%)
            </div>
            <div style="font-size: 11.5px; color: #6b8075; margin-bottom: 8px;">
              Status: <strong>${c.status}</strong> • Reports: <strong>${c.reportsCount} citizen logs</strong>
            </div>
            ${
              c.assignedStaffName
                ? `<div style="font-size: 11px; color: #1b5e20; background: #e8f5e9; padding: 4px 8px; border-radius: 6px; margin-bottom: 8px;">
                    Assigned: ${c.assignedStaffName}
                  </div>`
                : `<div style="font-size: 11px; color: #dc2626; background: #fee2e2; padding: 4px 8px; border-radius: 6px; margin-bottom: 8px;">
                    ⚠️ Unassigned P1 Ticket
                  </div>`
            }
          </div>
        `);

        cmpLayer.addLayer(customMarker);
      });
    }

    // 3. Render Smart Bins
    binLayer.clearLayers();
    if (layersVisible.smartBins && smartBins) {
      smartBins.forEach((b) => {
        if (!b.lat || !b.lng) return;

        const isOverflow = b.fillLevel >= 85;
        const binColor = isOverflow ? "#dc2626" : b.fillLevel > 70 ? "#d97706" : "#16a34a";

        const binHtml = `
          <div style="
            width: 26px;
            height: 26px;
            background: #ffffff;
            border: 2px solid ${binColor};
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            font-size: 11px;
            font-weight: 800;
            color: ${binColor};
          ">
            ${b.fillLevel}%
          </div>
        `;

        const binMarker = L.marker([b.lat, b.lng], {
          icon: L.divIcon({
            html: binHtml,
            className: "leaflet-bin-pin",
            iconSize: [26, 26],
            iconAnchor: [13, 13]
          })
        });

        binMarker.bindPopup(`
          <div style="padding: 12px; min-width: 220px;">
            <div style="font-size: 11px; font-weight: 700; color: ${binColor};">SMART IOT BIN • ${b.code}</div>
            <div style="font-size: 13.5px; font-weight: 800; color: #132a1e; margin: 3px 0 6px;">${b.location}</div>
            <div style="font-size: 12px; color: #4a6356; margin-bottom: 4px;">Fill Level: <strong style="color: ${binColor};">${b.fillLevel}%</strong></div>
            <div style="font-size: 12px; color: #4a6356; margin-bottom: 4px;">Category: <strong>${b.category}</strong></div>
            <div style="font-size: 12px; color: #4a6356; margin-bottom: 6px;">Battery: <strong>${b.batteryLevel}%</strong></div>
          </div>
        `);

        binLayer.addLayer(binMarker);
      });
    }

    // 4. Render Fleet Vehicles
    vehLayer.clearLayers();
    if (layersVisible.vehicles && vehicles) {
      vehicles.forEach((v) => {
        if (!v.gpsCoordinates) return;

        const truckHtml = `
          <div style="
            width: 30px;
            height: 30px;
            background: #1e3a8a;
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            color: #ffffff;
            font-size: 13px;
          ">
            🚛
          </div>
        `;

        const truckMarker = L.marker(v.gpsCoordinates, {
          icon: L.divIcon({
            html: truckHtml,
            className: "leaflet-truck-pin",
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          })
        });

        truckMarker.bindPopup(`
          <div style="padding: 12px; min-width: 220px;">
            <div style="font-size: 11px; font-weight: 700; color: #2563eb;">MUNICIPAL FLEET TRUCK</div>
            <div style="font-size: 14px; font-weight: 800; color: #132a1e; margin: 2px 0;">${v.plateNumber}</div>
            <div style="font-size: 12px; color: #4a6356; margin-bottom: 4px;">Type: <strong>${v.type}</strong></div>
            <div style="font-size: 12px; color: #4a6356; margin-bottom: 4px;">Driver: <strong>${v.currentDriver}</strong></div>
            <div style="font-size: 12px; color: #4a6356; margin-bottom: 4px;">Current Load: <strong>${v.currentLoadTons} / ${v.capacityTons} Tons</strong></div>
            <div style="font-size: 12px; color: #16a34a; font-weight: 700;">Status: ${v.status} (${v.speedKmH} km/h)</div>
          </div>
        `);

        vehLayer.addLayer(truckMarker);
      });
    }
  }, [layersVisible, complaints, wards, smartBins, vehicles, onSelectComplaint]);

  // Center map on selected complaint if passed
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedComplaintId || !complaints) return;
    const cmp = complaints.find((c) => c.id === selectedComplaintId);
    if (cmp && cmp.lat && cmp.lng) {
      mapInstanceRef.current.setView([cmp.lat, cmp.lng], 15, { animate: true });
    }
  }, [selectedComplaintId, complaints]);

  const toggleLayer = (layerKey) => {
    setLayersVisible((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      {/* Map Filter Controls Floating Overlay */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          zIndex: 500,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(6px)",
          padding: "10px 14px",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          fontSize: "12px"
        }}
      >
        <div style={{ fontWeight: "800", color: "#132a1e", display: "flex", alignItems: "center", gap: "6px" }}>
          <Layers size={14} color="#1b5e20" />
          <span>GIS Layers &amp; Overlays</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={layersVisible.complaints}
              onChange={() => toggleLayer("complaints")}
            />
            <span>📍 Complaint Markers ({complaints.length})</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={layersVisible.hotspots}
              onChange={() => toggleLayer("hotspots")}
            />
            <span style={{ color: "#dc2626", fontWeight: "600" }}>🔥 Hotspot Clusters</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={layersVisible.wards}
              onChange={() => toggleLayer("wards")}
            />
            <span>🟩 Ward Boundaries ({wards.length})</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={layersVisible.smartBins}
              onChange={() => toggleLayer("smartBins")}
            />
            <span>🗑️ Smart IoT Bins ({smartBins.length})</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={layersVisible.vehicles}
              onChange={() => toggleLayer("vehicles")}
            />
            <span>🚛 Fleet Trucks ({vehicles.length})</span>
          </label>
        </div>
      </div>

      {/* Leaflet Container */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
