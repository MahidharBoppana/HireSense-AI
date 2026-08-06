import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import SuperAdminDashboard from "../pages/super-admin/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import RecruiterDashboard from "../pages/recruiter/Dashboard";
import HiringManagerDashboard from "../pages/hiring-manager/Dashboard";

import NotFound from "../pages/shared/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/super-admin/dashboard"
          element={<SuperAdminDashboard />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/hiring-manager/dashboard"
          element={<HiringManagerDashboard />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;