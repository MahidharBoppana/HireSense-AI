import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getAssignedApplications } from "../../services/application.service";

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
    <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${classes}`}>
      {status
        ?.replace("_", " ")
        ?.replace(/\b\w/g, (char) => char.toUpperCase())}
    </span>
  );
}

function HiringManagerApplications() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "hiring-manager-applications",
      debouncedSearch,
      statusFilter,
      sortBy,
      page,
    ],
    queryFn: () =>
      getAssignedApplications({
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        sort: sortBy || undefined,
        page,
        limit,
      }),
  });

  const applications = response?.data || [];

  const hasNextPage = applications.length === limit;
  const hasPreviousPage = page > 1;

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-indigo-400">Hiring Manager</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Applications
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review candidates assigned to you.
        </p>
      </div>

      {/* Filters */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search candidate..."
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="screening">Screening</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
          >
            <option value="">Newest First</option>
            <option value="-aiScore">AI Score: High to Low</option>
            <option value="aiScore">AI Score: Low to High</option>
          </select>
        </div>
      </section>

      {/* Error */}

      {isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <h2 className="text-lg font-semibold text-red-400">
            Unable to load applications
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {error?.response?.data?.message ||
              "Something went wrong while loading applications."}
          </p>
        </div>
      )}

      {/* Applications */}

      {!isError && (
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading applications...
                </p>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                C
              </div>

              <h3 className="mt-4 font-medium text-white">
                No applications found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                No applications match your current filters.
              </p>
            </div>
          ) : (
            <>
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
                        Experience
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        AI Score
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

                          <td className="px-6 py-4 text-sm text-slate-400">
                            {candidate?.totalExperience !== undefined
                              ? `${candidate.totalExperience} years`
                              : "Not specified"}
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

              {/* Pagination */}

              <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
                <p className="text-sm text-slate-500">
                  Page <span className="text-slate-300">{page}</span>
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((current) => current - 1)}
                    disabled={!hasPreviousPage}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => setPage((current) => current + 1)}
                    disabled={!hasNextPage}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default HiringManagerApplications;
