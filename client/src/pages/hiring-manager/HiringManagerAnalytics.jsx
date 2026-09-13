import { useQuery } from "@tanstack/react-query";
import { getHiringManagerDashboard } from "../../services/analytics.service";

const HiringManagerAnalytics = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["hiring-manager-analytics"],
    queryFn: getHiringManagerDashboard,
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
  const pipeline = analytics.pipeline || {};

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

  const totalApplications = pipelineItems.reduce(
    (total, item) => total + item.value,
    0,
  );

  const cards = [
    {
      title: "Assigned Applications",
      value: analytics.assignedApplications || 0,
      color: "text-indigo-400",
    },
    {
      title: "Shortlisted",
      value: pipeline.shortlisted || 0,
      color: "text-blue-400",
    },
    {
      title: "Interviews",
      value: pipeline.interview || 0,
      color: "text-purple-400",
    },
    {
      title: "Hired",
      value: pipeline.hired || 0,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-indigo-400">Hiring Insights</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Analytics
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Track your assigned candidates and hiring pipeline.
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

      {/* Pipeline */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="font-semibold text-white">Hiring Pipeline</h2>

          <p className="mt-1 text-sm text-slate-500">
            Distribution of your assigned applications.
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

      {/* Hiring Summary */}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Interview Workload</h2>

          <p className="mt-1 text-sm text-slate-500">
            Applications currently requiring interview activity.
          </p>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Interviews</p>

                <p className="mt-2 text-3xl font-bold text-purple-400">
                  {pipeline.interview || 0}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                I
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Hiring Performance</h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of completed hiring decisions.
          </p>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Hired Candidates</p>

                <p className="mt-2 text-3xl font-bold text-emerald-400">
                  {pipeline.hired || 0}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                H
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Details */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="font-semibold text-white">Pipeline Details</h2>

          <p className="mt-1 text-sm text-slate-500">
            Detailed breakdown of your assigned applications.
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

export default HiringManagerAnalytics;
