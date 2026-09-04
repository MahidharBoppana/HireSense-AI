import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useFieldArray } from "react-hook-form";

import {
  getCandidateById,
  updateCandidate,
} from "../../services/candidate.service";

function CandidateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      skills: "",
      github: "",
      linkedin: "",
      portfolio: "",
      summary: "",
      totalExperience: 0,

      education: [],
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
    },
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control,
    name: "achievements",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });

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

  useEffect(() => {
    const candidate = response?.data;

    if (!candidate) return;

    reset({
      fullName: candidate.fullName || "",
      email: candidate.email || "",
      phone: candidate.phone || "",
      skills: candidate.skills?.join(", ") || "",
      github: candidate.github || "",
      linkedin: candidate.linkedin || "",
      portfolio: candidate.portfolio || "",
      summary: candidate.summary || "",
      totalExperience: candidate.totalExperience || 0,

      education:
        candidate.education?.map((item) => ({
          ...item,
          startDate: item.startDate
            ? new Date(item.startDate).toISOString().split("T")[0]
            : "",
          endDate: item.endDate
            ? new Date(item.endDate).toISOString().split("T")[0]
            : "",
        })) || [],

      experience: candidate.experience || [],

      projects:
        candidate.projects?.map((project) => ({
          ...project,
          technologies: Array.isArray(project.technologies)
            ? project.technologies.join(", ")
            : project.technologies || "",
        })) || [],

      certifications: candidate.certifications || [],
      achievements: candidate.achievements || [],
      languages: candidate.languages || [],
    });
  }, [response, reset]);

  const updateMutation = useMutation({
    mutationFn: updateCandidate,

    onSuccess: (response) => {
      toast.success(response?.message || "Candidate updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["candidate", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["recruiter-candidates"],
      });

      navigate(`/recruiter/candidates/${id}`);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update candidate",
      );
    },
  });

  const onSubmit = (data) => {
    const candidateData = {
      ...data,

      skills: data.skills
        ? data.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],

      projects: (data.projects || []).map((project) => ({
        ...project,
        technologies:
          typeof project.technologies === "string"
            ? project.technologies
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : project.technologies || [],
      })),

      totalExperience: Number(data.totalExperience) || 0,
    };

    updateMutation.mutate({
      candidateId: id,
      data: candidateData,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

          <p className="mt-4 text-sm text-slate-400">Loading candidate...</p>
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
          {error?.response?.data?.message || "Something went wrong."}
        </p>

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
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}

      <div>
        <button
          type="button"
          onClick={() => navigate(`/recruiter/candidates/${id}`)}
          className="mb-3 text-sm text-slate-400 hover:text-white"
        >
          ← Back to Candidate
        </button>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Edit Candidate
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Update candidate profile information.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Basic Information</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Full Name
              </label>

              <input
                {...register("fullName", {
                  required: true,
                })}
                className="input-field"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">Email</label>

              <input
                type="email"
                {...register("email", {
                  required: true,
                })}
                className="input-field"
                placeholder="Email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">Phone</label>

              <input
                {...register("phone")}
                className="input-field"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Total Experience
              </label>

              <input
                type="number"
                min="0"
                step="0.1"
                {...register("totalExperience")}
                className="input-field"
                placeholder="Years"
              />
            </div>
          </div>
        </section>

        {/* Skills */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Skills</h2>

          <input
            {...register("skills")}
            className="input-field mt-5"
            placeholder="React, Node.js, MongoDB, JavaScript"
          />

          <p className="mt-2 text-xs text-slate-500">
            Separate skills using commas.
          </p>
        </section>

        {/* Professional Links */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Professional Links</h2>

          <div className="mt-5 space-y-4">
            <input
              {...register("github")}
              className="input-field"
              placeholder="GitHub URL"
            />

            <input
              {...register("linkedin")}
              className="input-field"
              placeholder="LinkedIn URL"
            />

            <input
              {...register("portfolio")}
              className="input-field"
              placeholder="Portfolio URL"
            />
          </div>
        </section>

        {/* Summary */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Summary</h2>

          <textarea
            {...register("summary")}
            rows={6}
            className="input-field mt-5 resize-none"
            placeholder="Candidate professional summary"
          />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Education</h2>

            <button
              type="button"
              onClick={() =>
                appendEducation({
                  degree: "",
                  institution: "",
                  fieldOfStudy: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              + Add
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {educationFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    {...register(`education.${index}.degree`)}
                    placeholder="Degree"
                    className="input-field"
                  />

                  <input
                    {...register(`education.${index}.institution`)}
                    placeholder="Institution"
                    className="input-field"
                  />

                  <select
                    {...register(`education.${index}.fieldOfStudy`)}
                    className="input-field"
                  >
                    <option value="">Select Field of Study</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Computer Application">
                      Computer Application
                    </option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Electronics">Electronics</option>
                    <option value="Electrical Engineering">
                      Electrical Engineering
                    </option>
                    <option value="Mechanical Engineering">
                      Mechanical Engineering
                    </option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Artificial Intelligence">
                      Artificial Intelligence
                    </option>
                    <option value="Commerce">Commerce</option>
                    <option value="Business Administration">
                      Business Administration
                    </option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    type="date"
                    {...register(`education.${index}.startDate`)}
                    className="input-field"
                  />

                  <input
                    type="date"
                    {...register(`education.${index}.endDate`)}
                    className="input-field"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="mt-3 text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Experience</h2>

            <button
              type="button"
              onClick={() =>
                appendExperience({
                  company: "",
                  designation: "",
                  startDate: "",
                  endDate: "",
                  currentlyWorking: false,
                  description: "",
                })
              }
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              + Add
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {experienceFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    {...register(`experience.${index}.designation`)}
                    placeholder="Designation"
                    className="input-field"
                  />

                  <input
                    {...register(`experience.${index}.company`)}
                    placeholder="Company"
                    className="input-field"
                  />

                  <input
                    type="date"
                    {...register(`experience.${index}.startDate`)}
                    className="input-field"
                  />

                  <input
                    type="date"
                    {...register(`experience.${index}.endDate`)}
                    className="input-field"
                  />
                </div>

                <textarea
                  {...register(`experience.${index}.description`)}
                  placeholder="Description"
                  rows={4}
                  className="input-field mt-4 resize-none"
                />

                <label className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                  <input
                    type="checkbox"
                    {...register(`experience.${index}.currentlyWorking`)}
                  />
                  Currently working here
                </label>

                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="mt-3 text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Projects</h2>

            <button
              type="button"
              onClick={() =>
                appendProject({
                  title: "",
                  description: "",
                  technologies: "",
                  github: "",
                  live: "",
                })
              }
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              + Add
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {projectFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <input
                  {...register(`projects.${index}.title`)}
                  placeholder="Project Title"
                  className="input-field"
                />

                <textarea
                  {...register(`projects.${index}.description`)}
                  placeholder="Project Description"
                  rows={4}
                  className="input-field mt-4 resize-none"
                />

                <input
                  {...register(`projects.${index}.technologies`)}
                  placeholder="React, Node.js, MongoDB"
                  className="input-field mt-4"
                />

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <input
                    {...register(`projects.${index}.github`)}
                    placeholder="GitHub URL"
                    className="input-field"
                  />

                  <input
                    {...register(`projects.${index}.live`)}
                    placeholder="Live URL"
                    className="input-field"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="mt-3 text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Certifications</h2>

            <button
              type="button"
              onClick={() =>
                appendCertification({
                  name: "",
                  organization: "",
                  issueDate: "",
                })
              }
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              + Add
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {certificationFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    {...register(`certifications.${index}.name`)}
                    placeholder="Certification Name"
                    className="input-field"
                  />

                  <input
                    {...register(`certifications.${index}.organization`)}
                    placeholder="Organization"
                    className="input-field"
                  />

                  <input
                    type="date"
                    {...register(`certifications.${index}.issueDate`)}
                    className="input-field"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="mt-3 text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Achievements</h2>

            <button
              type="button"
              onClick={() => appendAchievement({ type: "" })}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              + Add
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {achievementFields.map((field, index) => (
              <div key={field.id} className="flex gap-3">
                <input
                  {...register(`achievements.${index}.type`)}
                  placeholder="Achievement"
                  className="input-field"
                />

                <button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  className="text-xs text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Languages</h2>

            <button
              type="button"
              onClick={() => appendLanguage("")}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              + Add
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {languageFields.map((field, index) => (
              <div key={field.id} className="flex gap-3">
                <input
                  {...register(`languages.${index}`)}
                  placeholder="Language"
                  className="input-field"
                />

                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="text-xs text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/recruiter/candidates/${id}`)}
            disabled={updateMutation.isPending}
            className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updateMutation.isPending || isSubmitting}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? "Updating..." : "Update Candidate"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CandidateEdit;
