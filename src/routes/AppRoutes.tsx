import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import DashboardRoutes from "./DashboardRoutes";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
