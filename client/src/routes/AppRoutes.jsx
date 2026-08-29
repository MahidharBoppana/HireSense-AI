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

// Recruiter
import RecruiterJobs from "../pages/recruiter/Jobs";
import RecruiterJobDetails from "../pages/recruiter/JobDetails";
import RecruiterCandidates from "../pages/recruiter/Candidates.jsx";
import CandidateDetails from "../pages/recruiter/CandidateDetails";

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

        {/* Recruiter */}
        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashboard />}
            />

            <Route path="/recruiter/jobs" element={<RecruiterJobs />} />

            <Route
              path="/recruiter/jobs/:id"
              element={<RecruiterJobDetails />}
            />

            <Route
              path="/recruiter/candidates"
              element={<RecruiterCandidates />}
            />

            <Route
              path="/recruiter/candidates/:id"
              element={<CandidateDetails />}
            />
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
