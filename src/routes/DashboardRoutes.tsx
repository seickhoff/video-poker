import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardProvider } from "../context/DashboardProvider";
import DashboardOverview from "../pages/DashboardOverview";
import DashboardReports from "../pages/DashboardReports";
import DashboardStats from "../pages/DashboardStats";
import DashboardView from "../pages/DashboardView";

export default function DashboardRoutes() {
  return (
    <DashboardProvider>
      <Routes>
        {/* Dashboard main entry point should redirect to /overview */}
        <Route
          path="/"
          element={<Navigate to="dashboard/overview" replace />}
        />

        {/* Define the rest of your routes */}
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="view" element={<DashboardView />} />
        <Route path="analytics/reports" element={<DashboardReports />} />
        <Route path="analytics/stats" element={<DashboardStats />} />

        {/* Catch-all route to redirect any unmatched /dashboard/* routes */}
        <Route
          path="*"
          element={<Navigate to="dashboard/overview" replace />}
        />
      </Routes>
    </DashboardProvider>
  );
}
