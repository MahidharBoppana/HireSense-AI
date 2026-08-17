import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import SuperAdminDashboard from "../pages/super-admin/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import RecruiterDashboard from "../pages/recruiter/Dashboard";
import HiringManagerDashboard from "../pages/hiring-manager/Dashboard";

import NotFound from "../pages/shared/NotFound";
import Unauthorized from "../pages/shared/Unauthorized";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import Admins from "../pages/super-admin/Admins";
import Recruiters from "../pages/super-admin/Recruiters";
import HiringManagers from "../pages/super-admin/HiringManagers";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        <Route path="/" element={<Login />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Super Admin */}

        <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/super-admin/dashboard"
              element={<SuperAdminDashboard />}
            />

            <Route path="/super-admin/admins" element={<Admins />} />

            <Route path="/super-admin/recruiters" element={<Recruiters />} />
            
            <Route
              path="/super-admin/hiring-managers"
              element={<HiringManagers />}
            />
          </Route>
        </Route>

        {/* Admin */}

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Recruiter */}

        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashboard />}
            />
          </Route>
        </Route>

        {/* Hiring Manager */}

        <Route element={<ProtectedRoute allowedRoles={["hiring_manager"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/hiring-manager/dashboard"
              element={<HiringManagerDashboard />}
            />
          </Route>
        </Route>

        {/* 404 */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
