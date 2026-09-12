import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getAssignedApplications } from "../../services/application.service";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const classes =
    status === "screening"
      ? "bg-blue-500/10 text-blue-400"
      : status === "shortlisted"
        ? "bg-emerald-500/10 text-emerald-400"
        : status === "interview"
          ? "bg-purple-500/10 text-purple-400"
          : status === "hired"
            ? "bg-green-500/10 text-green-400"
            : "bg-red-500/10 text-red-400";

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-medium ${classes}`}
    >
      {status
        ?.replace("_", " ")
        ?.replace(/\b\w/g, (char) => char.toUpperCase())}
    </span>
  );
}

function HiringManagerDashboard() {
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["hiring-manager-applications"],
    queryFn: () => getAssignedApplications(),
  });

  const applications = response?.data || [];

  const stats = {
    total: applications.length,

    screening: applications.filter(
      (application) => application.status === "screening",
    ).length,

    shortlisted: applications.filter(
      (application) => application.status === "shortlisted",
    ).length,

    interview: applications.filter(
      (application) => application.status === "interview",
    ).length,

    hired: applications.filter(
      (application) => application.status === "hired",
    ).length,

    rejected: applications.filter(
      (application) => application.status === "rejected",
    ).length,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading dashboard...
          </p>
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

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-indigo-400">
          Hiring Manager
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review and manage candidates assigned to you.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Screening" value={stats.screening} />
        <StatCard label="Shortlisted" value={stats.shortlisted} />
        <StatCard label="Interview" value={stats.interview} />
        <StatCard label="Hired" value={stats.hired} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>

      {/* Applications */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-white">
            Assigned Applications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Candidates assigned to you for review.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-500">
              C
            </div>

            <h3 className="mt-4 font-medium text-white">
              No applications assigned
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Applications assigned to you will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-950/70">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Candidate
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Job
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    AI Score
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Updated
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {applications.map((application) => {
                  const candidate = application.candidate;
                  const job = application.job;

                  return (
                    <tr
                      key={application._id}
                      className="transition hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 font-semibold text-indigo-400">
                            {candidate?.fullName
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </div>

                          <div>
                            <p className="font-medium text-white">
                              {candidate?.fullName || "Unknown Candidate"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {candidate?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">
                          {job?.title || "Unknown Job"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {job?.company || ""}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={application.status} />
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-indigo-400">
                          {application.aiScore
                            ? `${application.aiScore}/100`
                            : "Pending"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400">
                        {application.updatedAt
                          ? new Date(
                              application.updatedAt,
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate(
                              `/hiring-manager/applications/${application._id}`,
                            )
                          }
                          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default HiringManagerDashboard;