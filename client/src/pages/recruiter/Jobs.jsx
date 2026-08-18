import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getJobs, createJob } from "../../services/job.service";
import { getActiveHiringManagers } from "../../services/user.service";

import CreateJobModal from "../../components/modals/CreateJobModal";

function Jobs() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: hiringManagersResponse, isLoading: isHiringManagersLoading } =
    useQuery({
      queryKey: ["hiringManagers"],
      queryFn: getActiveHiringManagers,
    });

  const hiringManagers = hiringManagersResponse?.data || [];

  const createJobMutation = useMutation({
    mutationFn: createJob,

    onSuccess: (response) => {
      toast.success(response?.message || "Job created successfully");

      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      setIsCreateModalOpen(false);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create job");
    },
  });

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "jobs",
      {
        search,
        status,
        employmentType,
      },
    ],
    queryFn: () =>
      getJobs({
        search: search || undefined,
        status: status || undefined,
        employmentType: employmentType || undefined,
      }),
  });

  if (isLoading) {
    return (
      <div className="min-h-[500px] rounded-2xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

            <p className="mt-4 text-sm text-slate-400">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Unable to load jobs
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            "Something went wrong while loading jobs."}
        </p>
      </div>
    );
  }

  const jobs = response?.data || [];

  const draftJobs = jobs.filter((job) => job.status === "draft").length;

  const openJobs = jobs.filter((job) => job.status === "open").length;

  const closedJobs = jobs.filter((job) => job.status === "closed").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-400">Job Management</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Jobs
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Manage job openings, requirements, hiring managers, and recruitment
            status.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          + Create Job
        </button>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <p className="text-sm text-slate-400">Total Jobs</p>

          <p className="mt-3 text-3xl font-bold text-white">{jobs.length}</p>
        </div>

        {/* Open */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <p className="text-sm text-slate-400">Open</p>

          <p className="mt-3 text-3xl font-bold text-emerald-400">{openJobs}</p>
        </div>

        {/* Draft */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <p className="text-sm text-slate-400">Draft</p>

          <p className="mt-3 text-3xl font-bold text-amber-400">{draftJobs}</p>
        </div>

        {/* Closed */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <p className="text-sm text-slate-400">Closed</p>

          <p className="mt-3 text-3xl font-bold text-red-400">{closedJobs}</p>
        </div>
      </div>

      {/* Job Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
        {/* Filters */}

        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-white">Job Openings</h2>

            <p className="mt-1 text-sm text-slate-500">
              All active and archived job openings.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 sm:w-64"
            />

            {/* Status */}

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

            {/* Employment Type */}

            <select
              value={employmentType}
              onChange={(event) => setEmploymentType(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="">All Employment Types</option>

              <option value="full_time">Full Time</option>

              <option value="part_time">Part Time</option>

              <option value="contract">Contract</option>

              <option value="internship">Internship</option>

              <option value="remote">Remote</option>

              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-slate-950/70">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Job
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Company
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Location
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Employment
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Hiring Manager
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {jobs.map((job) => (
                <tr key={job._id} className="transition hover:bg-slate-800/40">
                  {/* Job */}

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{job.title}</p>

                      <p className="mt-1 text-xs text-slate-500">
                        {job.department}
                      </p>
                    </div>
                  </td>

                  {/* Company */}

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {job.company}
                  </td>

                  {/* Location */}

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {job.location}
                  </td>

                  {/* Employment */}

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                      {job.employmentType
                        ?.replace("_", " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </span>
                  </td>

                  {/* Hiring Manager */}

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {job.hiringManager ? (
                      `${job.hiringManager.firstName || ""} ${
                        job.hiringManager.lastName || ""
                      }`
                    ) : (
                      <span className="text-slate-600">Not assigned</span>
                    )}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                        job.status === "open"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : job.status === "draft"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          job.status === "open"
                            ? "bg-emerald-400"
                            : job.status === "draft"
                              ? "bg-amber-400"
                              : "bg-red-400"
                        }`}
                      />

                      {job.status?.charAt(0).toUpperCase() +
                        job.status?.slice(1)}
                    </span>
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400">
                        View
                      </button>

                      <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}

        {jobs.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-xl text-slate-500">
              J
            </div>

            <h3 className="mt-4 font-semibold text-white">No jobs found</h3>

            <p className="mt-2 text-sm text-slate-500">
              Create your first job opening to get started.
            </p>
          </div>
        )}
      </div>
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createJobMutation.mutate(data)}
        hiringManagers={hiringManagers}
        isSubmitting={createJobMutation.isPending}
      />
    </div>
  );
}

export default Jobs;
