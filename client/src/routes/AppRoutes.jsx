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

// Super Admin
import Admins from "../pages/super-admin/Admins";
import Monitoring from "../pages/super-admin/Monitoring";

// Admin
import Recruiters from "../pages/admin/Recruiters";
import HiringManagers from "../pages/admin/HiringManagers";

import Jobs from "../pages/recruiter/Jobs";

// Job Management will be moved to Recruiter later
// import Jobs from "../pages/recruiter/Jobs";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            Public Routes
        ===================================================== */}

        <Route path="/" element={<Login />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* =====================================================
            Super Admin
        ===================================================== */}

        <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/super-admin/dashboard"
              element={<SuperAdminDashboard />}
            />

            <Route path="/super-admin/admins" element={<Admins />} />

            <Route path="/super-admin/monitoring" element={<Monitoring />} />
          </Route>
        </Route>

        {/* =====================================================
            Admin
        ===================================================== */}

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/admin/recruiters" element={<Recruiters />} />

            <Route path="/admin/hiring-managers" element={<HiringManagers />} />
          </Route>
        </Route>

        {/* =====================================================
            Recruiter
        ===================================================== */}

        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashboard />}
            />

            {/* Job Management will be added here */}
            <Route path="/recruiter/jobs" element={<Jobs />} />
          </Route>
        </Route>

        {/* =====================================================
            Hiring Manager
        ===================================================== */}

        <Route element={<ProtectedRoute allowedRoles={["hiring_manager"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/hiring-manager/dashboard"
              element={<HiringManagerDashboard />}
            />
          </Route>
        </Route>

        {/* =====================================================
            404
        ===================================================== */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
