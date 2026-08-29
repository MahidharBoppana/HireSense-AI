import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { getCandidateById } from "../../services/candidate.service";

function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["candidate", id],
    queryFn: () => getCandidateById(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-[500px] rounded-2xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

            <p className="mt-4 text-sm text-slate-400">Loading candidate...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Unable to load candidate
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            "Something went wrong while loading the candidate."}
        </p>

        <button
          onClick={() => navigate("/recruiter/candidates")}
          className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  const candidate = response?.data;

  if (!candidate) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h2 className="text-lg font-semibold text-white">
          Candidate not found
        </h2>

        <button
          onClick={() => navigate("/recruiter/candidates")}
          className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate("/recruiter/candidates")}
            className="mb-3 text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Candidates
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-xl font-semibold text-indigo-400">
              {candidate.fullName?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {candidate.fullName}
              </h1>

              <p className="mt-1 text-sm text-slate-400">Candidate Profile</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {candidate.resumeUrl && (
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
            >
              View Resume
            </a>
          )}

          <button
            onClick={() =>
              navigate(`/recruiter/candidates/${candidate._id}/edit`)
            }
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Edit Candidate
          </button>
        </div>
      </div>

      {/* Basic Information */}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Contact Information</h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Email
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {candidate.email || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Phone
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {candidate.phone || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Total Experience
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {candidate.totalExperience ?? 0} years
              </p>
            </div>
          </div>
        </div>

        {/* Professional Links */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Professional Links</h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                GitHub
              </p>

              {candidate.github ? (
                <a
                  href={candidate.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block truncate text-sm text-indigo-400 hover:text-indigo-300"
                >
                  {candidate.github}
                </a>
              ) : (
                <p className="mt-1 text-sm text-slate-500">Not specified</p>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                LinkedIn
              </p>

              {candidate.linkedin ? (
                <a
                  href={candidate.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block truncate text-sm text-indigo-400 hover:text-indigo-300"
                >
                  {candidate.linkedin}
                </a>
              ) : (
                <p className="mt-1 text-sm text-slate-500">Not specified</p>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Portfolio
              </p>

              {candidate.portfolio ? (
                <a
                  href={candidate.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block truncate text-sm text-indigo-400 hover:text-indigo-300"
                >
                  {candidate.portfolio}
                </a>
              ) : (
                <p className="mt-1 text-sm text-slate-500">Not specified</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="font-semibold text-white">Skills</h2>

        {candidate.skills?.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {candidate.skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-full bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-400"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No skills added.</p>
        )}
      </div>

      {/* Summary */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="font-semibold text-white">Summary</h2>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-400">
          {candidate.summary || "No summary available."}
        </p>
      </div>

      {/* Education */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="font-semibold text-white">Education</h2>

        {candidate.education?.length > 0 ? (
          <div className="mt-5 space-y-4">
            {candidate.education.map((education, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-medium text-white">
                  {education.degree || "Degree not specified"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {education.institution || "Institution not specified"}
                </p>

                {education.fieldOfStudy && (
                  <p className="mt-1 text-xs text-slate-500">
                    {education.fieldOfStudy}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No education information available.
          </p>
        )}
      </div>

      {/* Experience */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="font-semibold text-white">Experience</h2>

        {candidate.experience?.length > 0 ? (
          <div className="mt-5 space-y-4">
            {candidate.experience.map((experience, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-medium text-white">
                  {experience.designation || "Designation not specified"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {experience.company || "Company not specified"}
                </p>

                {experience.description && (
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {experience.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No experience information available.
          </p>
        )}
      </div>

      {/* Projects */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="font-semibold text-white">Projects</h2>

        {candidate.projects?.length > 0 ? (
          <div className="mt-5 space-y-4">
            {candidate.projects.map((project, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-medium text-white">
                  {project.title || "Project"}
                </p>

                {project.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {project.description}
                  </p>
                )}

                {project.technologies?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((technology, techIndex) => (
                      <span
                        key={`${technology}-${techIndex}`}
                        className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No projects available.</p>
        )}
      </div>

      {/* Certifications */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="font-semibold text-white">Certifications</h2>

        {candidate.certifications?.length > 0 ? (
          <div className="mt-5 space-y-3">
            {candidate.certifications.map((certification, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-medium text-white">{certification.name}</p>

                <p className="mt-1 text-sm text-slate-400">
                  {certification.organization}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No certifications available.
          </p>
        )}
      </div>
    </div>
  );
}

export default CandidateDetails;
