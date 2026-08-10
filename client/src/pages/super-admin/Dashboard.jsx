import { useQuery } from "@tanstack/react-query";

import { getSuperAdminDashboard } from "../../services/analytics.service";

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm font-medium text-slate-400">{title}</p>

      <p className="mt-3 text-3xl font-bold text-white">{value}</p>

      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function Dashboard() {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["super-admin-dashboard"],
    queryFn: getSuperAdminDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-900 bg-red-950/30 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-red-300">
          {error?.response?.data?.message ||
            "Something went wrong while loading the dashboard."}
        </p>
      </div>
    );
  }

  const dashboard = response?.data;

  const admins = dashboard?.users?.admins ?? 0;
  const recruiters = dashboard?.users?.recruiters ?? 0;
  const hiringManagers = dashboard?.users?.hiringManagers ?? 0;

  const jobs = dashboard?.jobs ?? 0;
  const candidates = dashboard?.candidates ?? 0;
  const applications = dashboard?.applications ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>

        <p className="mt-2 text-slate-400">
          Overview of your HireSense AI recruitment platform.
        </p>
      </div>

      {/* User Statistics */}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Users</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Active Admins"
            value={admins}
            description="Active administrator accounts"
          />

          <StatCard
            title="Active Recruiters"
            value={recruiters}
            description="Active recruiter accounts"
          />

          <StatCard
            title="Hiring Managers"
            value={hiringManagers}
            description="Active hiring managers"
          />
        </div>
      </section>

      {/* Recruitment Statistics */}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Recruitment Overview
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Jobs"
            value={jobs}
            description="Total active job records"
          />

          <StatCard
            title="Candidates"
            value={candidates}
            description="Total candidate profiles"
          />

          <StatCard
            title="Applications"
            value={applications}
            description="Total applications"
          />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
