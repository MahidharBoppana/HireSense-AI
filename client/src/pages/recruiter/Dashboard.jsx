import { useQuery } from "@tanstack/react-query";

import { getRecruiterDashboard } from "../../services/analytics.service";

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-400">{title}</p>

      <p className="mt-3 text-3xl font-bold text-white">{value}</p>

      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function PipelineCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
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
    queryKey: ["recruiter-dashboard"],
    queryFn: getRecruiterDashboard,
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

  const dashboard = response?.data;

  const totalJobs = dashboard?.totalJobs ?? 0;
  const totalApplications = dashboard?.totalApplications ?? 0;

  const pipeline = dashboard?.pipeline || {};

  const screening = pipeline.screening ?? 0;
  const shortlisted = pipeline.shortlisted ?? 0;
  const interview = pipeline.interview ?? 0;
  const hired = pipeline.hired ?? 0;
  const rejected = pipeline.rejected ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-indigo-400">
          Recruiter Workspace
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Overview of your jobs, applications, and recruitment pipeline.
        </p>
      </div>

      {/* Main Statistics */}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Overview</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            title="Total Jobs"
            value={totalJobs}
            description="Jobs created by you"
          />

          <StatCard
            title="Total Applications"
            value={totalApplications}
            description="Applications received for your jobs"
          />
        </div>
      </section>

      {/* Recruitment Pipeline */}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Recruitment Pipeline
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <PipelineCard title="Screening" value={screening} />

          <PipelineCard title="Shortlisted" value={shortlisted} />

          <PipelineCard title="Interview" value={interview} />

          <PipelineCard title="Hired" value={hired} />

          <PipelineCard title="Rejected" value={rejected} />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
