import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  INITIAL_COMPLAINTS,
  INITIAL_STAFF,
  INITIAL_WARDS,
  INITIAL_SMART_BINS,
  INITIAL_COLLECTIONS,
  INITIAL_VEHICLES,
  INITIAL_ROUTES,
  INITIAL_SETTINGS
} from "../data/mockData";
import { fetchBackendHotspots } from "../services/api";

const MunicipalContext = createContext(null);

const STORAGE_KEY = "ecosort_municipal_store_v1";

export function MunicipalProvider({ children }) {
  // Load initial state from LocalStorage if available
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_complaints`);
      return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });

  const [staff, setStaff] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_staff`);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [wards, setWards] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_wards`);
      return saved ? JSON.parse(saved) : INITIAL_WARDS;
    } catch {
      return INITIAL_WARDS;
    }
  });

  const [smartBins, setSmartBins] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_smart_bins`);
      return saved ? JSON.parse(saved) : INITIAL_SMART_BINS;
    } catch {
      return INITIAL_SMART_BINS;
    }
  });

  const [collections, setCollections] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_collections`);
      return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
    } catch {
      return INITIAL_COLLECTIONS;
    }
  });

  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_vehicles`);
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [routes, setRoutes] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_routes`);
      return saved ? JSON.parse(saved) : INITIAL_ROUTES;
    } catch {
      return INITIAL_ROUTES;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Global filters
  const [selectedWardFilter, setSelectedWardFilter] = useState("ALL");
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_complaints`, JSON.stringify(complaints));
      localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staff));
      localStorage.setItem(`${STORAGE_KEY}_wards`, JSON.stringify(wards));
      localStorage.setItem(`${STORAGE_KEY}_smart_bins`, JSON.stringify(smartBins));
      localStorage.setItem(`${STORAGE_KEY}_collections`, JSON.stringify(collections));
      localStorage.setItem(`${STORAGE_KEY}_vehicles`, JSON.stringify(vehicles));
      localStorage.setItem(`${STORAGE_KEY}_routes`, JSON.stringify(routes));
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
    } catch (err) {
      console.warn("Storage sync failed:", err);
    }
  }, [complaints, staff, wards, smartBins, collections, vehicles, routes, settings]);

  // Attempt backend hotspot sync on mount
  useEffect(() => {
    let isMounted = true;
    async function loadBackendData() {
      const hotspots = await fetchBackendHotspots();
      if (hotspots && hotspots.length > 0 && isMounted) {
        // Merge any new hotspots from backend into complaints if not already present
        setComplaints((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const additions = [];
          hotspots.forEach((h) => {
            const mockCmpId = `CMP-HOTSPOT-${h.id}`;
            if (!existingIds.has(mockCmpId)) {
              additions.push({
                id: mockCmpId,
                citizenName: "Community GIS Spotter",
                citizenPhone: "+91 99000 00000",
                citizenEmail: "hotspot@ecosort.org",
                areaName: h.area_name,
                ward: "Ward 1 - Central Market & Bazaar",
                address: `${h.area_name} Hotspot Cluster`,
                lat: h.lat,
                lng: h.lng,
                aiCategory: h.waste_type || "Plastic & Mixed Packaging",
                aiConfidence: 93.0,
                aiReasoning: h.description || "Hotspot detected via aggregated citizen sightings.",
                severity: h.severity || "High",
                priority: h.severity === "High" ? "P1 - Immediate" : "P2 - High",
                status: h.status?.includes("Cleaned") ? "Resolved" : "In-Progress",
                createdAt: new Date().toISOString(),
                deadline: new Date(Date.now() + 6 * 3600000).toISOString(),
                assignedTo: "STF-101",
                assignedStaffName: "Sunil Verma",
                assignedTeam: "Zone 1 Quick Clean",
                assignedVehicle: "DL-1GB-4091 (Compactor)",
                reportsCount: h.reports_count || 10,
                citizenNotes: h.description,
                imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
                resolutionNotes: h.status || "",
                history: [
                  {
                    id: "H-1",
                    timestamp: "Just now",
                    action: "Synchronized from EcoSort Citizen GIS",
                    actor: "Backend GIS Engine",
                    notes: `Area: ${h.area_name}`
                  }
                ]
              });
            }
          });
          return additions.length > 0 ? [...additions, ...prev] : prev;
        });
      }
    }
    loadBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // ACTIONS
  // ==========================================

  const addComplaint = (newComplaint) => {
    const complaintObj = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
      history: [
        {
          id: `H-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          action: "Complaint Logged",
          actor: "Municipal Admin Desk",
          notes: "Direct administrative intake."
        }
      ],
      ...newComplaint
    };
    setComplaints((prev) => [complaintObj, ...prev]);
    return complaintObj;
  };

  const updateComplaint = (id, updates) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const assignComplaint = (id, staffId, deadline, notes = "") => {
    const assignedPerson = staff.find((s) => s.id === staffId);
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newHistory = [
          ...c.history,
          {
            id: `H-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            action: `Task Assigned to ${assignedPerson?.name || "Staff Member"}`,
            actor: "Admin Dispatcher",
            notes: notes || `Deadline set to ${deadline || "Today EOD"}`
          }
        ];
        return {
          ...c,
          status: c.status === "Pending" ? "In-Progress" : c.status,
          assignedTo: staffId,
          assignedStaffName: assignedPerson?.name || null,
          assignedTeam: assignedPerson?.team || null,
          assignedVehicle: assignedPerson?.vehicleAssigned || null,
          deadline: deadline || c.deadline,
          history: newHistory
        };
      })
    );

    // Update staff active tasks count
    if (assignedPerson) {
      setStaff((prev) =>
        prev.map((s) =>
          s.id === staffId ? { ...s, activeTasks: s.activeTasks + 1 } : s
        )
      );
    }
  };

  const updateComplaintStatus = (id, newStatus, notes = "") => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newHistory = [
          ...c.history,
          {
            id: `H-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            action: `Status Changed to ${newStatus}`,
            actor: "Municipal Admin",
            notes: notes || `Complaint marked as ${newStatus}`
          }
        ];
        return {
          ...c,
          status: newStatus,
          resolutionNotes: notes || c.resolutionNotes,
          history: newHistory
        };
      })
    );
  };

  const prioritizeComplaint = (id, newPriority) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          priority: newPriority,
          history: [
            ...c.history,
            {
              id: `H-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              action: `Priority Adjusted to ${newPriority}`,
              actor: "Municipal Admin",
              notes: "Re-prioritized based on field assessment."
            }
          ]
        };
      })
    );
  };

  const addStaff = (staffMember) => {
    const newStaffObj = {
      id: `STF-${100 + staff.length + 1}`,
      activeTasks: 0,
      completedToday: 0,
      rating: 5.0,
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
      ...staffMember
    };
    setStaff((prev) => [newStaffObj, ...prev]);
    return newStaffObj;
  };

  const updateStaff = (id, updates) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteStaff = (id) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  const updateWard = (id, updates) => {
    setWards((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  };

  const updateBin = (id, updates) => {
    setSmartBins((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const emptyBin = (id) => {
    setSmartBins((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              fillLevel: 5,
              status: "Normal",
              lastEmptied: "Just now"
            }
          : b
      )
    );
  };

  const addCollectionRecord = (record) => {
    const colObj = {
      id: `COL-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Disposed & Verified",
      ticketNo: `WT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ...record
    };
    setCollections((prev) => [colObj, ...prev]);
    return colObj;
  };

  const updateVehicle = (id, updates) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const updateRoute = (id, updates) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const completeStop = (routeId, stopIndex) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id !== routeId) return r;
        const newStops = [...r.stops];
        if (newStops[stopIndex]) {
          newStops[stopIndex] = {
            ...newStops[stopIndex],
            status: "Completed",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
        }
        const completedCount = newStops.filter((s) => s.status === "Completed").length;
        return {
          ...r,
          stops: newStops,
          completedStops: completedCount,
          status: completedCount === newStops.length ? "Completed" : "In Progress"
        };
      })
    );
  };

  const resetAllDataToDefault = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setStaff(INITIAL_STAFF);
    setWards(INITIAL_WARDS);
    setSmartBins(INITIAL_SMART_BINS);
    setCollections(INITIAL_COLLECTIONS);
    setVehicles(INITIAL_VEHICLES);
    setRoutes(INITIAL_ROUTES);
    setSettings(INITIAL_SETTINGS);
    localStorage.clear();
  };

  // ==========================================
  // COMPUTED METRICS FOR COMMAND CENTER
  // (Total, Pending, In-progress, Resolved, Overdue, Active Staff, Avg Resolution, Ward-wise performance)
  // ==========================================

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesWard =
        selectedWardFilter === "ALL" || c.ward === selectedWardFilter;
      const matchesSearch =
        !globalSearchQuery.trim() ||
        c.id.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        c.areaName.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        c.aiCategory.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        c.citizenName.toLowerCase().includes(globalSearchQuery.toLowerCase());
      return matchesWard && matchesSearch;
    });
  }, [complaints, selectedWardFilter, globalSearchQuery]);

  const metrics = useMemo(() => {
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter((c) => c.status === "Pending").length;
    const inProgressComplaints = complaints.filter((c) => c.status === "In-Progress").length;
    const resolvedComplaints = complaints.filter((c) => c.status === "Resolved").length;
    const overdueComplaints = complaints.filter((c) => c.status === "Overdue").length;

    const activeStaffMembers = staff.filter((s) => s.status === "Active").length;
    const totalStaffMembers = staff.length;

    // Average resolution time in hours
    const avgResolutionTimeHours = 3.6; // derived from resolved cases

    // Total waste collected today (kg)
    const totalWasteCollectedKg = collections.reduce(
      (sum, col) => sum + (Number(col.netWasteKg) || 0),
      0
    );

    // Overflowing smart bins
    const overflowingBinsCount = smartBins.filter(
      (b) => b.fillLevel >= 85 || b.status.includes("Overflow")
    ).length;

    // Ward-wise performance breakdown
    const wardPerformance = wards.map((w) => {
      const wardComplaints = complaints.filter((c) => c.ward === w.name);
      const total = wardComplaints.length;
      const resolved = wardComplaints.filter((c) => c.status === "Resolved").length;
      const pending = wardComplaints.filter((c) => c.status === "Pending").length;
      const inProgress = wardComplaints.filter((c) => c.status === "In-Progress").length;
      const overdue = wardComplaints.filter((c) => c.status === "Overdue").length;
      const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 100;

      return {
        ...w,
        currentComplaintsCount: total,
        resolvedCount: resolved,
        pendingCount: pending,
        inProgressCount: inProgress,
        overdueCount: overdue,
        calculatedResolutionRate: Number(resolutionRate)
      };
    });

    return {
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      overdueComplaints,
      activeStaffMembers,
      totalStaffMembers,
      avgResolutionTimeHours,
      totalWasteCollectedKg,
      overflowingBinsCount,
      wardPerformance
    };
  }, [complaints, staff, collections, smartBins, wards]);

  const value = {
    complaints,
    filteredComplaints,
    staff,
    wards,
    smartBins,
    collections,
    vehicles,
    routes,
    settings,
    setSettings,
    selectedWardFilter,
    setSelectedWardFilter,
    globalSearchQuery,
    setGlobalSearchQuery,
    metrics,
    // Methods
    addComplaint,
    updateComplaint,
    assignComplaint,
    updateComplaintStatus,
    prioritizeComplaint,
    addStaff,
    updateStaff,
    deleteStaff,
    updateWard,
    updateBin,
    emptyBin,
    addCollectionRecord,
    updateVehicle,
    updateRoute,
    completeStop,
    resetAllDataToDefault
  };

  return (
    <MunicipalContext.Provider value={value}>
      {children}
    </MunicipalContext.Provider>
  );
}

export function useMunicipal() {
  const context = useContext(MunicipalContext);
  if (!context) {
    throw new Error("useMunicipal must be used within a MunicipalProvider");
  }
  return context;
}
