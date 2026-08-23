import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard } from "../../services/analytics.service";

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
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
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

          <p className="mt-4 text-sm text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            "Something went wrong while loading the dashboard."}
        </p>
      </div>
    );
  }

  const dashboard = response?.data ?? {};

  const recruiters = dashboard.recruiters ?? 0;
  const hiringManagers = dashboard.hiringManagers ?? 0;
  const activeJobs = dashboard.activeJobs ?? 0;
  const totalApplications = dashboard.totalApplications ?? 0;

  const pipeline = dashboard.hiringPipeline ?? {};

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-indigo-400">Admin Dashboard</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Monitor recruiters, hiring managers, jobs, and recruitment activity
          across the platform.
        </p>
      </div>

      {/* User Overview */}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">User Overview</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            title="Recruiters"
            value={recruiters}
            description="Active recruiter accounts"
          />

          <StatCard
            title="Hiring Managers"
            value={hiringManagers}
            description="Active hiring manager accounts"
          />
        </div>
      </section>

      {/* Recruitment Overview */}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Recruitment Overview
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            title="Active Jobs"
            value={activeJobs}
            description="Currently open job positions"
          />

          <StatCard
            title="Applications"
            value={totalApplications}
            description="Total applications received"
          />
        </div>
      </section>

      {/* Hiring Pipeline */}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Hiring Pipeline
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Screening"
            value={pipeline.screening ?? 0}
            description="Applications being screened"
          />

          <StatCard
            title="Shortlisted"
            value={pipeline.shortlisted ?? 0}
            description="Shortlisted candidates"
          />

          <StatCard
            title="Interview"
            value={pipeline.interview ?? 0}
            description="Candidates in interview"
          />

          <StatCard
            title="Hired"
            value={pipeline.hired ?? 0}
            description="Successfully hired"
          />

          <StatCard
            title="Rejected"
            value={pipeline.rejected ?? 0}
            description="Rejected applications"
          />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
