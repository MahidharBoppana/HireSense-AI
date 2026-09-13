import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../../services/analytics.service";

const AdminAnalytics = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: getAdminDashboard,
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

  const pipeline = analytics.hiringPipeline || {};

  const cards = [
    {
      title: "Recruiters",
      value: analytics.recruiters || 0,
      color: "text-indigo-400",
    },
    {
      title: "Hiring Managers",
      value: analytics.hiringManagers || 0,
      color: "text-purple-400",
    },
    {
      title: "Active Jobs",
      value: analytics.activeJobs || 0,
      color: "text-emerald-400",
    },
    {
      title: "Applications",
      value: analytics.totalApplications || 0,
      color: "text-blue-400",
    },
  ];

  const pipelineItems = [
    {
      label: "Screening",
      value: pipeline.screening || 0,
    },
    {
      label: "Shortlisted",
      value: pipeline.shortlisted || 0,
    },
    {
      label: "Interview",
      value: pipeline.interview || 0,
    },
    {
      label: "Hired",
      value: pipeline.hired || 0,
    },
    {
      label: "Rejected",
      value: pipeline.rejected || 0,
    },
  ];

  const totalApplications = pipelineItems.reduce(
    (total, item) => total + item.value,
    0,
  );

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-indigo-400">
          Organization Insights
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Analytics
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Monitor your recruitment team and hiring pipeline.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
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

      {/* Hiring Pipeline */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="font-semibold text-white">Hiring Pipeline</h2>

          <p className="mt-1 text-sm text-slate-500">
            Organization-wide application distribution.
          </p>
        </div>

        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pipelineItems.map((item) => {
              const percentage =
                totalApplications > 0
                  ? Math.round((item.value / totalApplications) * 100)
                  : 0;

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{item.label}</p>

                    <p className="text-lg font-semibold text-white">
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

      {/* Team Overview */}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Recruitment Team</h2>

          <p className="mt-1 text-sm text-slate-500">
            Current active recruitment resources.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div>
                <p className="text-sm font-medium text-white">Recruiters</p>

                <p className="mt-1 text-xs text-slate-500">Active recruiters</p>
              </div>

              <span className="text-2xl font-bold text-indigo-400">
                {analytics.recruiters || 0}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Hiring Managers
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Active hiring managers
                </p>
              </div>

              <span className="text-2xl font-bold text-purple-400">
                {analytics.hiringManagers || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recruitment Summary */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Recruitment Summary</h2>

          <p className="mt-1 text-sm text-slate-500">
            Current organization-wide recruitment activity.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm text-slate-500">Active Jobs</p>

              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {analytics.activeJobs || 0}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm text-slate-500">Applications</p>

              <p className="mt-2 text-2xl font-bold text-blue-400">
                {analytics.totalApplications || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Details */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="font-semibold text-white">Pipeline Details</h2>

          <p className="mt-1 text-sm text-slate-500">
            Breakdown of applications across hiring stages.
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
                  totalApplications > 0
                    ? Math.round((item.value / totalApplications) * 100)
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

export default AdminAnalytics;
