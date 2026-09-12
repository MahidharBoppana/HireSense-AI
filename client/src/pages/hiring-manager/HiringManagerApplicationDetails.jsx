import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getAssignedApplicationById,
  addInterviewNotes,
  finalizeApplication,
  updateApplicationStatus,
} from "../../services/application.service";

import { useEffect, useState } from "react";

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

function HiringManagerApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["hiring-manager-application", id],
    queryFn: () => getAssignedApplicationById(id),
    enabled: !!id,
  });

  const application = response?.data;
  const candidate = application?.candidate;
  const job = application?.job;

  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState("");
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    if (application) {
      setNotes(application.interviewNotes || "");
      setRating(application.interviewRating || "");
      setRecommendation(application.interviewRecommendation || "");
    }
  }, [application]);

  const statusMutation = useMutation({
    mutationFn: ({ applicationId, status }) =>
      updateApplicationStatus({
        applicationId,
        status,
      }),

    onSuccess: (response) => {
      toast.success(
        response?.message || "Application status updated successfully",
      );

      queryClient.invalidateQueries({
        queryKey: ["hiring-manager-application", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["hiring-manager-applications"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update application status",
      );
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: addInterviewNotes,

    onSuccess: (response) => {
      toast.success(
        response?.message || "Interview feedback saved successfully",
      );

      queryClient.invalidateQueries({
        queryKey: ["hiring-manager-application", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["hiring-manager-applications"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to save interview feedback",
      );
    },
  });

  const finalDecisionMutation = useMutation({
    mutationFn: finalizeApplication,

    onSuccess: (response) => {
      toast.success(response?.message || "Final decision saved successfully");

      queryClient.invalidateQueries({
        queryKey: ["hiring-manager-application", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["hiring-manager-applications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["job-applications"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to save final decision",
      );
    },
  });

  const handleFeedbackSubmit = (event) => {
    event.preventDefault();

    if (!notes.trim()) {
      toast.error("Interview notes are required");
      return;
    }

    if (!rating) {
      toast.error("Please select an interview rating");
      return;
    }

    if (!recommendation) {
      toast.error("Please select a recommendation");
      return;
    }

    feedbackMutation.mutate({
      applicationId: id,
      interviewNotes: notes,
      interviewRating: Number(rating),
      interviewRecommendation: recommendation,
    });
  };

  const handleFinalDecision = (status) => {
    if (!hasInterviewFeedback) {
      toast.error(
        "Please save interview feedback before making the final decision",
      );
      return;
    }

    finalDecisionMutation.mutate({
      applicationId: id,
      status,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

          <p className="mt-4 text-sm text-slate-400">Loading application...</p>
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Unable to load application
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message || "Application not found."}
        </p>

        <button
          onClick={() => navigate("/hiring-manager/applications")}
          className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const hasInterviewFeedback =
    Boolean(application.interviewNotes?.trim()) &&
    Boolean(application.interviewRating) &&
    Boolean(application.interviewRecommendation);

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <button
          onClick={() => navigate("/hiring-manager/applications")}
          className="mb-4 text-sm font-medium text-slate-400 hover:text-white"
        >
          ← Back to Applications
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              Candidate Review
            </p>

            <h1 className="mt-1 text-3xl font-bold text-white">
              {candidate?.fullName || "Unknown Candidate"}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {job?.title || "Unknown Job"} · {job?.company || ""}
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

        {candidate?.summary && (
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Summary
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {candidate.summary}
            </p>
          </div>
        )}
      </section>

      {/* Resume */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Resume</h2>

            <p className="mt-1 text-sm text-slate-500">
              Review the candidate's submitted resume.
            </p>
          </div>

          {candidate?.resumeUrl && (
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Open Resume
            </a>
          )}
        </div>
      </section>

      {/* Skills */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Skills</h2>

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
            <p className="text-sm text-slate-500">No skills available.</p>
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
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Required Skills
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {job?.requiredSkills?.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-800 px-3 py-1.5 text-xs text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* AI Screening */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">AI Screening</h2>

            <p className="mt-1 text-sm text-slate-500">
              AI-generated candidate evaluation.
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Score
            </p>

            <p className="mt-1 text-3xl font-bold text-indigo-400">
              {application.aiScore || 0}/100
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Recommendation
          </p>

          <p className="mt-2 text-sm font-medium text-white">
            {application.recommendation
              ?.replace("_", " ")
              ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Pending"}
          </p>
        </div>

        {application.aiSummary && (
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              AI Summary
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {application.aiSummary}
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Matched Skills
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {application.matchedSkills?.length > 0 ? (
                application.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">None</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Missing Skills
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {application.missingSkills?.length > 0 ? (
                application.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs text-red-400"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">None</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {application.status === "shortlisted" && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">Interview</h2>

          <p className="mt-1 text-sm text-slate-500">
            Move this candidate to the interview stage.
          </p>

          <div className="mt-5">
            <button
              onClick={() =>
                statusMutation.mutate({
                  applicationId: id,
                  status: "interview",
                })
              }
              disabled={statusMutation.isPending}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {statusMutation.isPending ? "Updating..." : "Move to Interview"}
            </button>
          </div>
        </section>
      )}

      {/* Interview Feedback */}

      {application.status === "interview" && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Interview Feedback
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Record your interview evaluation before making the final decision.
            </p>
          </div>

          <form onSubmit={handleFeedbackSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300">
                Interview Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                placeholder="Enter interview feedback..."
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-300">
                  Interview Rating
                </label>

                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option value="">Select rating</option>
                  <option value="1">1 / 5</option>
                  <option value="2">2 / 5</option>
                  <option value="3">3 / 5</option>
                  <option value="4">4 / 5</option>
                  <option value="5">5 / 5</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">
                  Interview Recommendation
                </label>

                <select
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option value="">Select recommendation</option>
                  <option value="hire">Hire</option>
                  <option value="hold">Hold</option>
                  <option value="reject">Reject</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                All three fields are required.
              </p>

              <button
                type="submit"
                disabled={feedbackMutation.isPending}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {feedbackMutation.isPending
                  ? "Saving..."
                  : "Save Interview Feedback"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Existing Feedback */}

      {application.interviewNotes && application.status !== "interview" && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Interview Feedback
          </h2>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Notes
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {application.interviewNotes}
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
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
              value={application.interviewRecommendation}
            />
          </div>
        </section>
      )}

      {/* Final Decision */}

      {application.status === "interview" && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">Final Decision</h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete the interview evaluation before making the final hiring
            decision.
          </p>

          {!hasInterviewFeedback && (
            <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-sm text-amber-400">
                Interview notes, rating, and recommendation are required before
                making the final decision.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => handleFinalDecision("hired")}
              disabled={
                !hasInterviewFeedback || finalDecisionMutation.isPending
              }
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {finalDecisionMutation.isPending ? "Saving..." : "Hire Candidate"}
            </button>

            <button
              onClick={() => handleFinalDecision("rejected")}
              disabled={
                !hasInterviewFeedback || finalDecisionMutation.isPending
              }
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject Candidate
            </button>
          </div>
        </section>
      )}

      {/* Completed Decision */}

      {(application.status === "hired" ||
        application.status === "rejected") && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">Final Decision</h2>

          <div className="mt-5">
            <StatusBadge status={application.status} />
          </div>

          {application.reviewedAt && (
            <p className="mt-4 text-sm text-slate-500">
              Decision recorded on{" "}
              {new Date(application.reviewedAt).toLocaleString()}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

export default HiringManagerApplicationDetails;
