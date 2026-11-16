// EcoSort AI — Municipal API Integration Service
// Communicates with Citizen Portal backend (port 8000) and Municipal API (port 8001) with resilient local fallback

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const MUNICIPAL_BACKEND_URL =
  import.meta.env.VITE_MUNICIPAL_BACKEND_URL || "http://127.0.0.1:8001";

export const DEFAULT_COORDS = {
  lat: parseFloat(import.meta.env.VITE_MAP_DEFAULT_LAT) || 28.618,
  lng: parseFloat(import.meta.env.VITE_MAP_DEFAULT_LNG) || 77.215,
  zoom: parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM, 10) || 13
};

// 1. Fetch Citizen Portal Hotspots
export async function fetchBackendHotspots(lat = DEFAULT_COORDS.lat, lng = DEFAULT_COORDS.lng) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    // Try citizen portal backend first
    let res = await fetch(`${API_BASE_URL}/gis/hotspots?lat=${lat}&lng=${lng}`, {
      signal: controller.signal
    }).catch(() => null);

    // If citizen portal is offline, try municipal backend
    if (!res || !res.ok) {
      res = await fetch(`${MUNICIPAL_BACKEND_URL}/api/hotspots?lat=${lat}&lng=${lng}`, {
        signal: controller.signal
      }).catch(() => null);
    }

    clearTimeout(timeoutId);
    if (!res || !res.ok) return null;

    const data = await res.json();
    return data.hotspots || [];
  } catch (err) {
    return null;
  }
}

// 2. Dispatch Direct Municipal Action on Hotspot
export async function postMunicipalHotspotAction(hotspotId, actionType) {
  try {
    // Post to citizen backend to sync hotspot severity
    await fetch(`${API_BASE_URL}/gis/hotspots/${hotspotId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: actionType })
    }).catch(() => null);

    // Also post to municipal backend if active
    const res = await fetch(`${MUNICIPAL_BACKEND_URL}/api/hotspots/${hotspotId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: actionType })
    }).catch(() => null);

    if (res && res.ok) {
      return await res.json();
    }
    return { status: "success", simulated: true };
  } catch (err) {
    return { status: "success", simulated: true };
  }
}

// 3. Fetch Command Center Metrics from Backend
export async function fetchBackendMetrics() {
  try {
    const res = await fetch(`${MUNICIPAL_BACKEND_URL}/api/metrics`, {
      signal: AbortSignal.timeout(1500)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// 4. Save Weighbridge Ticket to Backend
export async function postWeighbridgeTicket(ticketData) {
  try {
    const res = await fetch(`${MUNICIPAL_BACKEND_URL}/api/collections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData)
    });
    if (!res.ok) throw new Error("Failed to post weighbridge ticket");
    return await res.json();
  } catch (err) {
    return { status: "success", simulated: true };
  }
}
