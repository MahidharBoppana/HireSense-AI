import { useQuery } from "@tanstack/react-query";
import { getSuperAdminAnalytics } from "../../services/analytics.service";

const SuperAdminAnalytics = () => {
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
      <div className="min-h-[500px] rounded-2xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
            <p className="mt-4 text-sm text-slate-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Unable to load analytics
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            "Something went wrong while loading analytics."}
        </p>
      </div>
    );
  }

  const analytics = response?.data || {};

  const userStatistics = analytics.userStatistics || {};
  const recruitmentStatistics = analytics.recruitmentStatistics || {};
  const pipeline = analytics.hiringPipeline || {};

  const overviewCards = [
    {
      title: "Total Users",
      value: userStatistics.totalUsers || 0,
      color: "text-indigo-400",
    },
    {
      title: "Active Users",
      value: userStatistics.activeUsers || 0,
      color: "text-emerald-400",
    },
    {
      title: "Admins",
      value: userStatistics.admins || 0,
      color: "text-blue-400",
    },
    {
      title: "Recruiters",
      value: userStatistics.recruiters || 0,
      color: "text-purple-400",
    },
    {
      title: "Hiring Managers",
      value: userStatistics.hiringManagers || 0,
      color: "text-orange-400",
    },
    {
      title: "Total Jobs",
      value: recruitmentStatistics.totalJobs || 0,
      color: "text-indigo-400",
    },
    {
      title: "Candidates",
      value: recruitmentStatistics.totalCandidates || 0,
      color: "text-cyan-400",
    },
    {
      title: "Applications",
      value: recruitmentStatistics.totalApplications || 0,
      color: "text-pink-400",
    },
  ];

  const pipelineItems = [
    {
      label: "Screening",
      value: pipeline.screening || 0,
      color: "text-indigo-400",
    },
    {
      label: "Shortlisted",
      value: pipeline.shortlisted || 0,
      color: "text-blue-400",
    },
    {
      label: "Interview",
      value: pipeline.interview || 0,
      color: "text-purple-400",
    },
    {
      label: "Hired",
      value: pipeline.hired || 0,
      color: "text-emerald-400",
    },
    {
      label: "Rejected",
      value: pipeline.rejected || 0,
      color: "text-red-400",
    },
  ];

  const totalPipelineApplications = pipelineItems.reduce(
    (total, item) => total + item.value,
    0,
  );

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-indigo-400">Platform Overview</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Super Admin Analytics
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Monitor users, recruitment activity, and hiring performance across the
          entire platform.
        </p>
      </div>

      {/* Overview */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
          >
            <p className="text-sm text-slate-400">{card.title}</p>

            <p className={`mt-3 text-3xl font-bold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* User Statistics */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="font-semibold text-white">User Statistics</h2>

          <p className="mt-1 text-sm text-slate-500">
            Platform user distribution and account activity.
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Total Users</p>

            <p className="mt-2 text-2xl font-bold text-white">
              {userStatistics.totalUsers || 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Active Users</p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {userStatistics.activeUsers || 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Inactive Users</p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {userStatistics.inactiveUsers || 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Admins</p>

            <p className="mt-2 text-2xl font-bold text-blue-400">
              {userStatistics.admins || 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Recruiters</p>

            <p className="mt-2 text-2xl font-bold text-purple-400">
              {userStatistics.recruiters || 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Hiring Managers</p>

            <p className="mt-2 text-2xl font-bold text-orange-400">
              {userStatistics.hiringManagers || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recruitment Statistics */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="font-semibold text-white">Recruitment Statistics</h2>

          <p className="mt-1 text-sm text-slate-500">
            Overall recruitment activity across the platform.
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Total Jobs</p>

            <p className="mt-2 text-2xl font-bold text-indigo-400">
              {recruitmentStatistics.totalJobs || 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Open Jobs</p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {recruitmentStatistics.openJobs || 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Draft Jobs</p>

            <p className="mt-2 text-2xl font-bold text-yellow-400">
              {recruitmentStatistics.draftJobs || 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Closed Jobs</p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {recruitmentStatistics.closedJobs || 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Candidates</p>

            <p className="mt-2 text-2xl font-bold text-cyan-400">
              {recruitmentStatistics.totalCandidates || 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Applications</p>

            <p className="mt-2 text-2xl font-bold text-pink-400">
              {recruitmentStatistics.totalApplications || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Hiring Pipeline */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="font-semibold text-white">Hiring Pipeline</h2>

          <p className="mt-1 text-sm text-slate-500">
            Application distribution across all hiring stages.
          </p>
        </div>

        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pipelineItems.map((item) => {
              const percentage =
                totalPipelineApplications > 0
                  ? Math.round((item.value / totalPipelineApplications) * 100)
                  : 0;

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{item.label}</p>

                    <p className={`text-lg font-semibold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {percentage}% of applications
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pipeline Details */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="font-semibold text-white">Pipeline Details</h2>

          <p className="mt-1 text-sm text-slate-500">
            Platform-wide application status breakdown.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-slate-950/70">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Stage
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Applications
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Percentage
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {pipelineItems.map((item) => {
                const percentage =
                  totalPipelineApplications > 0
                    ? Math.round((item.value / totalPipelineApplications) * 100)
                    : 0;

                return (
                  <tr
                    key={item.label}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {item.label}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {item.value}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {percentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAnalytics;
