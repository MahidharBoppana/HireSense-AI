import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getApplicationById,
  updateApplicationStatus,
} from "../../services/application.service";

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

function StatusBadge({ status }) {
  const statusClasses = {
    screening: "bg-blue-500/10 text-blue-400",
    shortlisted: "bg-emerald-500/10 text-emerald-400",
    interview: "bg-purple-500/10 text-purple-400",
    rejected: "bg-red-500/10 text-red-400",
    hired: "bg-green-500/10 text-green-400",
  };

  const formattedStatus = status
    ?.replace("_", " ")
    ?.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
        statusClasses[status] || "bg-slate-800 text-slate-300"
      }`}
    >
      {formattedStatus || "Unknown"}
    </span>
  );
}

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplicationById(id),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: updateApplicationStatus,

    onSuccess: (response) => {
      toast.success(
        response?.message || "Application status updated successfully",
      );

      queryClient.invalidateQueries({
        queryKey: ["application", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["job-applications"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update application status",
      );
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[500px] rounded-2xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

            <p className="mt-4 text-sm text-slate-400">
              Loading application...
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
          Unable to load application
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            "Something went wrong while loading the application."}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  const application = response?.data;

  if (!application) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h2 className="text-lg font-semibold text-white">
          Application not found
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  const candidate = application.candidate;
  const job = application.job;

  const canShortlist = application.status === "screening";
  const canReject =
    application.status === "screening" ||
    application.status === "shortlisted" ||
    application.status === "interview";

  const canMoveToInterview = application.status === "shortlisted";

  const handleStatusChange = (status) => {
    statusMutation.mutate({
      applicationId: application._id,
      status,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          ← Back
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              Application Details
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
              {candidate?.fullName || "Candidate"}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {job?.title || "Job"} · {job?.company || "Company"}
            </p>
          </div>

          <StatusBadge status={application.status} />
        </div>
      </div>

      {/* Candidate Information */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          Candidate Information
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Full Name" value={candidate?.fullName} />

          <InfoItem label="Email" value={candidate?.email} />

          <InfoItem label="Phone" value={candidate?.phone} />

          <InfoItem
            label="Experience"
            value={
              candidate?.totalExperience !== undefined
                ? `${candidate.totalExperience} years`
                : null
            }
          />
        </div>

        {candidate?.resumeUrl && (
          <div className="mt-6">
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-400 transition hover:bg-indigo-500/20"
            >
              View Resume
            </a>
          </div>
        )}
      </section>

      {/* Professional Links */}

      {(candidate?.github || candidate?.linkedin || candidate?.portfolio) && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Professional Links
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {candidate.github && (
              <a
                href={candidate.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-indigo-500 hover:text-indigo-400"
              >
                GitHub
              </a>
            )}

            {candidate.linkedin && (
              <a
                href={candidate.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-indigo-500 hover:text-indigo-400"
              >
                LinkedIn
              </a>
            )}

            {candidate.portfolio && (
              <a
                href={candidate.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-indigo-500 hover:text-indigo-400"
              >
                Portfolio
              </a>
            )}
          </div>
        </section>
      )}

      {/* Skills */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Candidate Skills</h2>

        <div className="mt-5 flex flex-wrap gap-2">
          {candidate?.skills?.length > 0 ? (
            candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">No skills specified.</p>
          )}
        </div>
      </section>

      {/* Job Information */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Job Information</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Job Title" value={job?.title} />

          <InfoItem label="Company" value={job?.company} />

          <InfoItem label="Department" value={job?.department} />

          <InfoItem label="Location" value={job?.location} />

          <InfoItem label="Employment Type" value={job?.employmentType} />

          <InfoItem
            label="Experience"
            value={
              job?.experience
                ? `${job.experience.min ?? 0} - ${
                    job.experience.max ?? "Any"
                  } years`
                : null
            }
          />
        </div>
      </section>

      {/* Required Skills */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Job Skills</h2>

        <p className="mt-5 text-sm font-medium text-slate-400">
          Required Skills
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {job?.requiredSkills?.length > 0 ? (
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

        <p className="mt-6 text-sm font-medium text-slate-400">
          Preferred Skills
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {job?.preferredSkills?.length > 0 ? (
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
      </section>

      {/* AI Screening */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">AI Screening</h2>

            <p className="mt-1 text-sm text-slate-500">
              AI-powered candidate evaluation.
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              AI Score
            </p>

            <p className="mt-1 text-3xl font-bold text-indigo-400">
              {application.aiScore ? `${application.aiScore}/100` : "Pending"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-slate-400">Recommendation</p>

            <p className="mt-2 text-sm text-slate-200">
              {application.recommendation
                ?.replace("_", " ")
                ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Pending"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-400">
              Screening Status
            </p>

            <p className="mt-2 text-sm text-slate-200">
              {application.screeningStatus
                ?.replace("_", " ")
                ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Pending"}
            </p>
          </div>
        </div>

        {/* Matched Skills */}

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-400">Matched Skills</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {application.matchedSkills?.length > 0 ? (
              application.matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">No matched skills yet.</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-400">Missing Skills</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {application.missingSkills?.length > 0 ? (
              application.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No missing skills identified.
              </p>
            )}
          </div>
        </div>

        {/* AI Summary */}

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-400">AI Summary</p>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {application.aiSummary ||
              "AI screening has not been completed yet."}
          </p>
        </div>
      </section>

      {/* Recruiter Notes */}

      {application.recruiterNotes && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">Recruiter Notes</h2>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {application.recruiterNotes}
          </p>
        </section>
      )}

      {/* Hiring Manager */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Hiring Manager</h2>

        {application.hiringManager ? (
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-lg font-semibold text-indigo-400">
              {application.hiringManager.firstName?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <p className="font-medium text-white">
                {application.hiringManager.firstName}{" "}
                {application.hiringManager.lastName}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {application.hiringManager.email}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No hiring manager assigned.
          </p>
        )}
      </section>

      {/* Interview Feedback */}

      {(application.interviewNotes ||
        application.interviewRating ||
        application.interviewRecommendation) && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Interview Feedback
          </h2>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <InfoItem
              label="Rating"
              value={
                application.interviewRating
                  ? `${application.interviewRating}/5`
                  : null
              }
            />

            <InfoItem
              label="Recommendation"
              value={application.interviewRecommendation
                ?.replace("_", " ")
                ?.replace(/\b\w/g, (char) => char.toUpperCase())}
            />
          </div>

          {application.interviewNotes && (
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-400">
                Interview Notes
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                {application.interviewNotes}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Status Actions */}

      {application.status !== "hired" && application.status !== "rejected" && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Application Actions
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {canShortlist && (
              <button
                onClick={() => handleStatusChange("shortlisted")}
                disabled={statusMutation.isPending}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Shortlist
              </button>
            )}

            {canMoveToInterview && (
              <button
                onClick={() => handleStatusChange("interview")}
                disabled={statusMutation.isPending}
                className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Move to Interview
              </button>
            )}

            {canReject && (
              <button
                onClick={() => handleStatusChange("rejected")}
                disabled={statusMutation.isPending}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default ApplicationDetails;
