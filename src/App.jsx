import { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "./components/layout/AdminSidebar";
import AdminHeader from "./components/layout/AdminHeader";

// Pages
import CommandCenter from "./pages/CommandCenter";
import ComplaintManagement from "./pages/ComplaintManagement";
import ComplaintDetails from "./pages/ComplaintDetails";
import LiveGarbageMapPage from "./pages/LiveGarbageMapPage";
import StaffManagement from "./pages/StaffManagement";
import TaskAssignment from "./pages/TaskAssignment";
import CollectionManagement from "./pages/CollectionManagement";
import RouteManagement from "./pages/RouteManagement";
import SmartBinMonitoring from "./pages/SmartBinMonitoring";
import ImpactAnalytics from "./pages/ImpactAnalytics";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";

import { useAuth } from "./context/AuthContext";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CommandCenter />} />
        <Route path="complaints" element={<ComplaintManagement />} />
        <Route path="complaints/:id" element={<ComplaintDetails />} />
        <Route path="map" element={<LiveGarbageMapPage />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="tasks" element={<TaskAssignment />} />
        <Route path="collections" element={<CollectionManagement />} />
        <Route path="routes" element={<RouteManagement />} />
        <Route path="smart-bins" element={<SmartBinMonitoring />} />
        <Route path="analytics" element={<ImpactAnalytics />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
