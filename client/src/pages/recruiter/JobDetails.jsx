import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { getJobById } from "../../services/job.service";
import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { updateJob } from "../../services/job.service";
import EditJobModal from "../../components/modals/EditJobModal";
import { getActiveHiringManagers } from "../../services/user.service.js";

import {
  getApplicationsByJob,
  createApplication,
} from "../../services/application.service";

import { getCandidates } from "../../services/candidate.service";

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-200">{value || "Not specified"}</p>
    </div>
  );
}

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const limit = 10;

  const queryClient = useQueryClient();

  const { data: hiringManagersResponse } = useQuery({
    queryKey: ["activeHiringManagers"],
    queryFn: getActiveHiringManagers,
  });

  const hiringManagers = hiringManagersResponse?.data || [];

  const { data: applicationsResponse, isLoading: isApplicationsLoading } =
    useQuery({
      queryKey: [
        "job-applications",
        id,
        debouncedSearch,
        statusFilter,
        sortBy,
        page,
      ],
      queryFn: () =>
        getApplicationsByJob(id, {
          search: debouncedSearch || undefined,
          status: statusFilter || undefined,
          sort: sortBy || undefined,
          page,
          limit,
        }),
      enabled: !!id,
    });

  const { data: candidatesResponse, isLoading: isCandidatesLoading } = useQuery(
    {
      queryKey: ["recruiter-candidates"],
      queryFn: () => getCandidates(),
    },
  );

  const candidates = candidatesResponse?.data || [];

  const applications = applicationsResponse?.data || [];

  console.log("Applications Response:", applicationsResponse);
  console.log("Applications:", applications);
  console.log("Job ID:", id);

  const updateJobMutation = useMutation({
    mutationFn: updateJob,

    onSuccess: (response) => {
      toast.success(response?.message || "Job updated successfully");

      // Refresh current job details
      queryClient.invalidateQueries({
        queryKey: ["job", id],
      });

      // Refresh jobs list
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      setIsEditModalOpen(false);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update job");
    },
  });

  const createApplicationMutation = useMutation({
    mutationFn: createApplication,

    onSuccess: (response) => {
      toast.success(response?.message || "Application created successfully");

      queryClient.invalidateQueries({
        queryKey: ["job-applications", id],
      });

      setIsAddCandidateModalOpen(false);
      setSelectedCandidate("");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create application",
      );
    },
  });

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });

  const handleAddCandidate = () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate");
      return;
    }

    createApplicationMutation.mutate({
      candidate: selectedCandidate,
      job: id,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] rounded-2xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

            <p className="mt-4 text-sm text-slate-400">
              Loading job details...
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
          Unable to load job
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            "Something went wrong while loading the job."}
        </p>

        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const job = response?.data;

  if (!job) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h2 className="text-lg font-semibold text-white">Job not found</h2>

        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const hiringManager = job.hiringManager;

  const createdBy = job.createdBy;

  const statusClasses =
    job.status === "open"
      ? "bg-emerald-500/10 text-emerald-400"
      : job.status === "draft"
        ? "bg-amber-500/10 text-amber-400"
        : "bg-red-500/10 text-red-400";

  const employmentType = job.employmentType
    ?.replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            onClick={() => navigate("/recruiter/jobs")}
            className="mb-4 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            ← Back to Jobs
          </button>

          <p className="text-sm font-medium text-indigo-400">Job Details</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            {job.title}
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {job.company} · {job.location}
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${statusClasses}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />

          {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
        </span>
      </div>

      {/* Basic Information */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Job Information</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Company" value={job.company} />

          <InfoItem label="Department" value={job.department} />

          <InfoItem label="Location" value={job.location} />

          <InfoItem label="Employment Type" value={employmentType} />
        </div>
      </section>

      {/* Description */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Job Description</h2>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
          {job.description}
        </p>
      </section>

      {/* Skills */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Skills</h2>

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-400">Required Skills</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {job.requiredSkills?.length > 0 ? (
              job.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No required skills specified.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-400">Preferred Skills</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {job.preferredSkills?.length > 0 ? (
              job.preferredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No preferred skills specified.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Experience & Salary */}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">Experience</h2>

          <div className="mt-5 grid grid-cols-2 gap-6">
            <InfoItem
              label="Minimum"
              value={
                job.experience?.min !== undefined
                  ? `${job.experience.min} years`
                  : null
              }
            />

            <InfoItem
              label="Maximum"
              value={
                job.experience?.max !== undefined
                  ? `${job.experience.max} years`
                  : null
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">Salary</h2>

          <div className="mt-5 grid grid-cols-2 gap-6">
            <InfoItem
              label="Minimum"
              value={
                job.salary?.min !== undefined
                  ? `${job.salary.currency || "INR"} ${job.salary.min}`
                  : null
              }
            />

            <InfoItem
              label="Maximum"
              value={
                job.salary?.max !== undefined
                  ? `${job.salary.currency || "INR"} ${job.salary.max}`
                  : null
              }
            />
          </div>
        </section>
      </div>

      {/* Hiring Manager */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Hiring Manager</h2>

        {hiringManager ? (
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-lg font-semibold text-indigo-400">
              {hiringManager.firstName?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <p className="font-medium text-white">
                {hiringManager.firstName} {hiringManager.lastName}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {hiringManager.email}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No hiring manager assigned.
          </p>
        )}
      </section>

      {/* Applications */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Applications</h2>

            <p className="mt-1 text-sm text-slate-500">
              Candidates added to this job.
            </p>
          </div>

          <button
            onClick={() => setIsAddCandidateModalOpen(true)}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            + Add Candidate
          </button>
        </div>

        <div className="border-b border-slate-800 p-6">
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
        </div>

        {isApplicationsLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

              <p className="mt-3 text-sm text-slate-500">
                Loading applications...
              </p>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-500">
              C
            </div>

            <h3 className="mt-4 font-medium text-white">No applications yet</h3>

            <p className="mt-2 text-sm text-slate-500">
              Add a candidate to this job to create an application.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-slate-950/70">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Candidate
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

                  return (
                    <tr
                      key={application._id}
                      className="transition hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 font-semibold text-indigo-400">
                            {candidate?.fullName?.charAt(0)?.toUpperCase() ||
                              "C"}
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

                      <td className="px-6 py-4 text-sm text-slate-400">
                        {candidate?.totalExperience !== undefined
                          ? `${candidate.totalExperience} years`
                          : "Not specified"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                            application.status === "screening"
                              ? "bg-blue-500/10 text-blue-400"
                              : application.status === "shortlisted"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : application.status === "interview"
                                  ? "bg-purple-500/10 text-purple-400"
                                  : application.status === "hired"
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {application.status
                            ?.replace("_", " ")
                            ?.replace(/\b\w/g, (char) => char.toUpperCase())}
                        </span>
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
                              `/recruiter/applications/${application._id}`,
                            )
                          }
                          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                        >
                          View
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

      {/* Metadata */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Job Metadata</h2>

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <InfoItem
            label="Created By"
            value={
              createdBy
                ? `${createdBy.firstName || ""} ${createdBy.lastName || ""}`
                : null
            }
          />

          <InfoItem
            label="Created On"
            value={
              job.createdAt ? new Date(job.createdAt).toLocaleString() : null
            }
          />

          <InfoItem
            label="Last Updated"
            value={
              job.updatedAt ? new Date(job.updatedAt).toLocaleString() : null
            }
          />

          <InfoItem label="Job ID" value={job._id} />
        </div>
      </section>

      {/* Actions */}

      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Back
        </button>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Edit Job
        </button>
      </div>
      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        job={job}
        hiringManagers={hiringManagers}
        onSubmit={(data) =>
          updateJobMutation.mutate({
            jobId: job._id,
            data,
          })
        }
        isSubmitting={updateJobMutation.isPending}
      />
      {/* Add Candidate Modal */}

      {isAddCandidateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="border-b border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Add Candidate
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add an existing candidate to this job.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsAddCandidateModalOpen(false);
                    setSelectedCandidate("");
                  }}
                  disabled={createApplicationMutation.isPending}
                  className="text-xl text-slate-500 transition hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <label className="text-sm font-medium text-slate-300">
                Candidate
              </label>

              <select
                value={selectedCandidate}
                onChange={(event) => setSelectedCandidate(event.target.value)}
                disabled={
                  isCandidatesLoading || createApplicationMutation.isPending
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="">
                  {isCandidatesLoading
                    ? "Loading candidates..."
                    : "Select candidate"}
                </option>

                {candidates.map((candidate) => (
                  <option key={candidate._id} value={candidate._id}>
                    {candidate.fullName} — {candidate.email}
                  </option>
                ))}
              </select>

              {candidates.length === 0 && !isCandidatesLoading && (
                <p className="mt-3 text-sm text-amber-400">
                  No candidates found. Create a candidate first.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 p-6">
              <button
                onClick={() => {
                  setIsAddCandidateModalOpen(false);
                  setSelectedCandidate("");
                }}
                disabled={createApplicationMutation.isPending}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleAddCandidate}
                disabled={
                  !selectedCandidate || createApplicationMutation.isPending
                }
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createApplicationMutation.isPending
                  ? "Adding..."
                  : "Add Candidate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;
