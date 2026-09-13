import { useQuery } from "@tanstack/react-query";
import { getRecruiterDashboard } from "../../services/analytics.service";

const RecruiterAnalytics = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recruiter-analytics"],
    queryFn: getRecruiterDashboard,
  });

  if (isLoading) {
    return (
      <div className="min-h-[500px] rounded-2xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

            <p className="mt-4 text-sm text-slate-400">
              Loading analytics...
            </p>
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

  const analytics = response?.data;

  const overview = analytics?.overview || {};
  const pipeline = analytics?.pipeline || {};
  const aiRecommendations = analytics?.aiRecommendations || {};
  const aiScores = analytics?.aiScores || {};
  const applicationsByJob = analytics?.applicationsByJob || [];

  const totalPipelineApplications =
    (pipeline.screening || 0) +
    (pipeline.shortlisted || 0) +
    (pipeline.interview || 0) +
    (pipeline.hired || 0) +
    (pipeline.rejected || 0);

  const cards = [
    {
      title: "Total Jobs",
      value: overview.totalJobs || 0,
      color: "text-indigo-400",
    },
    {
      title: "Active Jobs",
      value: overview.activeJobs || 0,
      color: "text-emerald-400",
    },
    {
      title: "Candidates",
      value: overview.totalCandidates || 0,
      color: "text-blue-400",
    },
    {
      title: "Applications",
      value: overview.totalApplications || 0,
      color: "text-purple-400",
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

  const recommendationItems = [
    {
      label: "Highly Recommended",
      value: aiRecommendations.highly_recommended || 0,
      color: "text-emerald-400",
      background: "bg-emerald-500/10",
    },
    {
      label: "Recommended",
      value: aiRecommendations.recommended || 0,
      color: "text-indigo-400",
      background: "bg-indigo-500/10",
    },
    {
      label: "Consider",
      value: aiRecommendations.consider || 0,
      color: "text-amber-400",
      background: "bg-amber-500/10",
    },
    {
      label: "Not Suitable",
      value: aiRecommendations.not_suitable || 0,
      color: "text-red-400",
      background: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-indigo-400">
          Recruitment Insights
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Analytics
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Track recruitment performance, candidate pipeline, and AI screening
          insights.
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
          <h2 className="font-semibold text-white">
            Hiring Pipeline
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current distribution of your applications.
          </p>
        </div>

        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pipelineItems.map((item) => {
              const percentage =
                totalPipelineApplications > 0
                  ? Math.round(
                      (item.value / totalPipelineApplications) * 100,
                    )
                  : 0;

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                      {item.label}
                    </p>

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

      {/* AI Section */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI Score */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <h2 className="font-semibold text-white">
              AI Score Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Candidate screening score statistics.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 divide-x divide-slate-800">
            <div className="pr-4">
              <p className="text-sm text-slate-500">
                Average
              </p>

              <p className="mt-2 text-3xl font-bold text-indigo-400">
                {aiScores.average || 0}
              </p>
            </div>

            <div className="px-4">
              <p className="text-sm text-slate-500">
                Highest
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {aiScores.highest || 0}
              </p>
            </div>

            <div className="pl-4">
              <p className="text-sm text-slate-500">
                Lowest
              </p>

              <p className="mt-2 text-3xl font-bold text-red-400">
                {aiScores.lowest || 0}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Average AI Score
              </span>

              <span className="text-sm font-semibold text-white">
                {aiScores.average || 0}/100
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{
                  width: `${Math.min(aiScores.average || 0, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* AI Recommendations */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <h2 className="font-semibold text-white">
              AI Recommendations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Candidate recommendations from AI screening.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {recommendationItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
              >
                <div
                  className={`inline-flex rounded-lg p-2 ${item.background}`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${item.color.replace(
                      "text-",
                      "bg-",
                    )}`}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  {item.label}
                </p>

                <p
                  className={`mt-1 text-2xl font-bold ${item.color}`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applications By Job */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="font-semibold text-white">
            Applications by Job
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Jobs ranked by application volume.
          </p>
        </div>

        {applicationsByJob.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-xl text-slate-500">
              A
            </div>

            <h3 className="mt-4 font-semibold text-white">
              No application data
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Application analytics will appear here once candidates
              apply to your jobs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-slate-950/70">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Job
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Company
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Applications
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Average AI Score
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {applicationsByJob.map((job) => (
                  <tr
                    key={job._id}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">
                        {job.title}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {job.company || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-300">
                      {job.applications || 0}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xl font-semibold text-indigo-400">
                        {job.averageScore || 0}
                      </span>

                      <span className="text-xl text-slate-600">
                        /100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterAnalytics;