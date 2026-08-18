import { useQuery } from "@tanstack/react-query";

import { getSuperAdminAnalytics } from "../../services/analytics.service";

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm font-medium text-slate-400">{title}</p>

      <p className="mt-3 text-3xl font-bold text-white">{value}</p>

      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function Monitoring() {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["super-admin-analytics"],
    queryFn: getSuperAdminAnalytics,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-slate-400">Loading platform analytics...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Unable to load platform analytics
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            "Something went wrong while loading analytics."}
        </p>
      </div>
    );
  }

  const analytics = response?.data;

  const users = analytics?.userStatistics ?? {};
  const recruitment = analytics?.recruitmentStatistics ?? {};
  const pipeline = analytics?.hiringPipeline ?? {};

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-indigo-400">
          Platform Monitoring
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          System Analytics
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Monitor system-wide users, recruitment activity, and hiring
          performance.
        </p>
      </div>

      {/* User Statistics */}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          User Statistics
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Users"
            value={users.totalUsers ?? 0}
            description="All platform users except Super Admins"
          />

          <StatCard
            title="Active Users"
            value={users.activeUsers ?? 0}
            description="Currently active users"
          />

          <StatCard
            title="Inactive Users"
            value={users.inactiveUsers ?? 0}
            description="Inactive user accounts"
          />

          <StatCard
            title="Admins"
            value={users.admins ?? 0}
            description="Administrator accounts"
          />

          <StatCard
            title="Recruiters"
            value={users.recruiters ?? 0}
            description="Recruiter accounts"
          />

          <StatCard
            title="Hiring Managers"
            value={users.hiringManagers ?? 0}
            description="Hiring manager accounts"
          />
        </div>
      </section>

      {/* Recruitment Statistics */}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Recruitment Statistics
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Jobs"
            value={recruitment.totalJobs ?? 0}
            description="All active job records"
          />

          <StatCard
            title="Open Jobs"
            value={recruitment.openJobs ?? 0}
            description="Currently open positions"
          />

          <StatCard
            title="Draft Jobs"
            value={recruitment.draftJobs ?? 0}
            description="Jobs still in draft"
          />

          <StatCard
            title="Closed Jobs"
            value={recruitment.closedJobs ?? 0}
            description="Closed job openings"
          />

          <StatCard
            title="Candidates"
            value={recruitment.totalCandidates ?? 0}
            description="Candidate profiles"
          />

          <StatCard
            title="Applications"
            value={recruitment.totalApplications ?? 0}
            description="Total applications"
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
            description="Candidates being screened"
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

export default Monitoring;
