import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { getJobById } from "../../services/job.service";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateJob } from "../../services/job.service";
import EditJobModal from "../../components/modals/EditJobModal";
import { getActiveHiringManagers } from "../../services/user.service.js";

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

  const queryClient = useQueryClient();

  const { data: hiringManagersResponse } = useQuery({
    queryKey: ["activeHiringManagers"],
    queryFn: getActiveHiringManagers,
  });

  const hiringManagers = hiringManagersResponse?.data || [];

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
    </div>
  );
}

export default JobDetails;
