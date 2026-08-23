import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../../services/job.service";
import { getActiveHiringManagers } from "../../services/user.service";

import CreateJobModal from "../../components/modals/CreateJobModal";
import EditJobModal from "../../components/modals/EditJobModal";
import DeleteJobModal from "../../components/modals/DeleteJobModal";

function Jobs() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Active Hiring Managers
  const { data: hiringManagersResponse, isLoading: isHiringManagersLoading } =
    useQuery({
      queryKey: ["active-hiring-managers"],
      queryFn: getActiveHiringManagers,
    });

  const hiringManagers = hiringManagersResponse?.data || [];

  // Create Job
  const createJobMutation = useMutation({
    mutationFn: createJob,

    onSuccess: (response) => {
      toast.success(response?.message || "Job created successfully");

      queryClient.invalidateQueries({
        queryKey: ["recruiter-jobs"],
      });

      setIsCreateModalOpen(false);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create job");
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: updateJob,

    onSuccess: (response) => {
      toast.success(response?.message || "Job updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["recruiter-jobs"],
      });

      setIsEditModalOpen(false);
      setSelectedJob(null);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update job");
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,

    onSuccess: (response) => {
      toast.success(response?.message || "Job deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["recruiter-jobs"],
      });

      setIsDeleteModalOpen(false);
      setSelectedJob(null);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete job");
    },
  });

  // Get Recruiter's Jobs
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "recruiter-jobs",
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

            <p className="mt-4 text-sm text-slate-400">Loading your jobs...</p>
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
            "Something went wrong while loading your jobs."}
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
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-400">Job Management</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            My Jobs
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Create and manage your job openings and recruitment requirements.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isHiringManagersLoading}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Create Job
        </button>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Jobs</p>

          <p className="mt-3 text-3xl font-bold text-white">{jobs.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Open</p>

          <p className="mt-3 text-3xl font-bold text-emerald-400">{openJobs}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Draft</p>

          <p className="mt-3 text-3xl font-bold text-amber-400">{draftJobs}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Closed</p>

          <p className="mt-3 text-3xl font-bold text-red-400">{closedJobs}</p>
        </div>
      </div>

      {/* Jobs */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {/* Filters */}

        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-white">Job Openings</h2>

            <p className="mt-1 text-sm text-slate-500">Jobs created by you.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 sm:w-64"
            />

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
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{job.title}</p>

                      <p className="mt-1 text-xs text-slate-500">
                        {job.department}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {job.company}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {job.location}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                      {job.employmentType
                        ?.replace("_", " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {job.hiringManager ? (
                      `${job.hiringManager.firstName || ""} ${
                        job.hiringManager.lastName || ""
                      }`
                    ) : (
                      <span className="text-slate-600">Not assigned</span>
                    )}
                  </td>

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

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/recruiter/jobs/${job._id}`)}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setIsEditModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDeleteModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty */}

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

      {/* Create Job Modal */}

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createJobMutation.mutate(data)}
        hiringManagers={hiringManagers}
        isSubmitting={createJobMutation.isPending}
      />

      {selectedJob && (
        <EditJobModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          hiringManagers={hiringManagers}
          onSubmit={(data) =>
            updateJobMutation.mutate({
              jobId: selectedJob._id,
              data,
            })
          }
          isSubmitting={updateJobMutation.isPending}
        />
      )}

      <DeleteJobModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        onConfirm={() => {
          deleteJobMutation.mutate(selectedJob._id);
        }}
        isDeleting={deleteJobMutation.isPending}
      />
    </div>
  );
}

export default Jobs;
