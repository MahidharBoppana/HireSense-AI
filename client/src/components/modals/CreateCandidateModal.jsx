import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";

import { uploadResume, parseResume } from "../../services/resume.service";

function CreateCandidateModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
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

  const educationFields = useFieldArray({
    control,
    name: "education",
  });

  const experienceFields = useFieldArray({
    control,
    name: "experience",
  });

  const projectFields = useFieldArray({
    control,
    name: "projects",
  });

  const certificationFields = useFieldArray({
    control,
    name: "certifications",
  });

  const achievementFields = useFieldArray({
    control,
    name: "achievements",
  });

  const languageFields = useFieldArray({
    control,
    name: "languages",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [parsedResume, setParsedResume] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);

  useEffect(() => {
    if (isOpen) {
      reset({
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
      });

      setResumeFile(null);
      setParsedResume(null);
      setIsUploadingResume(false);
      setIsParsingResume(false);
    }
  }, [isOpen, reset]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting || isUploadingResume || isParsingResume) {
      return;
    }

    reset();

    setResumeFile(null);
    setParsedResume(null);

    onClose();
  };

  /* =====================================================
     RESUME CHANGE
  ===================================================== */

  const handleResumeChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      setParsedResume(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and DOCX files are allowed");

      event.target.value = "";
      setResumeFile(null);
      setParsedResume(null);

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Resume must be less than 5 MB");

      event.target.value = "";
      setResumeFile(null);
      setParsedResume(null);

      return;
    }

    try {
      setResumeFile(file);
      setIsParsingResume(true);

      const response = await parseResume(file);

      const parsedData = response?.data?.parsedResume;

      if (!parsedData) {
        throw new Error("Failed to parse resume");
      }

      setParsedResume(parsedData);

      reset({
        fullName: parsedData.fullName || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",

        skills: parsedData.skills?.join(", ") || "",

        github: parsedData.github || "",
        linkedin: parsedData.linkedin || "",
        portfolio: parsedData.portfolio || "",

        summary: parsedData.summary || "",

        totalExperience: parsedData.totalExperience || 0,

        education: parsedData.education || [],

        experience: parsedData.experience || [],

        projects:
          parsedData.projects?.map((project) => ({
            ...project,
            technologies: Array.isArray(project.technologies)
              ? project.technologies.join(", ")
              : project.technologies || "",
          })) || [],

        certifications: parsedData.certifications || [],

        achievements: parsedData.achievements || [],

        languages: parsedData.languages || [],
      });

      toast.success("Resume analyzed successfully");
    } catch (error) {
      console.error("Resume parsing error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to analyze resume",
      );

      setResumeFile(null);
      setParsedResume(null);

      event.target.value = "";
    } finally {
      setIsParsingResume(false);
    }
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const submitForm = async (data) => {
    try {
      if (!resumeFile) {
        toast.error("Please upload a resume");
        return;
      }

      if (!parsedResume) {
        toast.error("Please wait for the resume to be analyzed");
        return;
      }

      /* ---------------------------------------------
         Upload Resume to Cloudinary
      --------------------------------------------- */

      setIsUploadingResume(true);

      const resumeResponse = await uploadResume(resumeFile);

      const resumeData = resumeResponse?.data;

      if (!resumeData?.resumeUrl || !resumeData?.resumePublicId) {
        throw new Error("Resume upload failed");
      }

      /* ---------------------------------------------
         Prepare Candidate Data
      --------------------------------------------- */

      const candidateData = {
        fullName: data.fullName?.trim() || "",

        email: data.email?.trim().toLowerCase() || "",

        phone: data.phone?.trim() || "",

        skills: data.skills
          ? data.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : [],

        education: data.education || [],

        experience: data.experience || [],

        projects: data.projects || [],

        certifications: data.certifications || [],

        achievements: data.achievements || [],

        languages: data.languages || [],

        github: data.github?.trim() || "",

        linkedin: data.linkedin?.trim() || "",

        portfolio: data.portfolio?.trim() || "",

        summary: data.summary?.trim() || "",

        totalExperience: Number(data.totalExperience) || 0,

        resumeUrl: resumeData.resumeUrl,

        resumePublicId: resumeData.resumePublicId,
      };

      /* ---------------------------------------------
         Create Candidate
      --------------------------------------------- */

      onSubmit(candidateData);

      setResumeFile(null);
      setParsedResume(null);
    } catch (error) {
      console.error("Create candidate error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create candidate",
      );
    } finally {
      setIsUploadingResume(false);
    }
  };

  const isLoading = isSubmitting || isUploadingResume || isParsingResume;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Create Candidate
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Upload a resume to automatically extract candidate information.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit(submitForm)} className="space-y-8 p-6">
          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Basic Information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Full Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />

                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  placeholder="john@example.com"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />

                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Phone
                </label>

                <input
                  type="text"
                  {...register("phone")}
                  placeholder="+91 9876543210"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />
              </div>

              {/* Experience */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Total Experience (Years)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  {...register("totalExperience", {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Experience cannot be negative",
                    },
                  })}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-50"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              RESUME
          ================================================= */}

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Resume
            </h3>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Resume File
              </label>

              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleResumeChange}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500 disabled:opacity-50"
              />

              <p className="mt-1 text-xs text-slate-500">
                PDF or DOCX only. Maximum size: 5 MB.
              </p>

              {resumeFile && (
                <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                  <p className="text-sm text-emerald-400">
                    {isParsingResume ? "Analyzing: " : "Selected: "}
                    {resumeFile.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}

              {parsedResume && (
                <div className="mt-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
                  <p className="text-sm font-medium text-indigo-400">
                    Resume analyzed successfully
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Extracted information has been added to the form below.
                    Review it before creating the candidate.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              SKILLS
          ================================================= */}

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Skills
            </h3>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Skills
              </label>

              <input
                type="text"
                {...register("skills")}
                placeholder="React, Node.js, MongoDB"
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
              />

              <p className="mt-1 text-xs text-slate-500">
                Separate skills with commas.
              </p>
            </div>
          </section>

          {/* =================================================
              PROFESSIONAL LINKS
          ================================================= */}

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Professional Links
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  GitHub
                </label>

                <input
                  type="url"
                  {...register("github")}
                  placeholder="https://github.com/username"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  LinkedIn
                </label>

                <input
                  type="url"
                  {...register("linkedin")}
                  placeholder="https://linkedin.com/in/username"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Portfolio
                </label>

                <input
                  type="url"
                  {...register("portfolio")}
                  placeholder="https://portfolio.com"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Summary
            </label>

            <textarea
              {...register("summary")}
              rows={5}
              placeholder="Brief summary of the candidate..."
              disabled={isLoading}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
            />
          </section>

          {/* =================================================
              EDUCATION
          ================================================= */}

          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Education
              </h3>

              <button
                type="button"
                onClick={() =>
                  educationFields.append({
                    degree: "",
                    institution: "",
                    fieldOfStudy: "",
                    startDate: null,
                    endDate: null,
                  })
                }
                disabled={isLoading}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                + Add Education
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {educationFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      {...register(`education.${index}.degree`)}
                      placeholder="Degree"
                      disabled={isLoading}
                      className="input-field"
                    />

                    <input
                      {...register(`education.${index}.institution`)}
                      placeholder="Institution"
                      disabled={isLoading}
                      className="input-field"
                    />

                    <input
                      {...register(`education.${index}.fieldOfStudy`)}
                      placeholder="Field of Study"
                      disabled={isLoading}
                      className="input-field"
                    />

                    <input
                      type="date"
                      {...register(`education.${index}.startDate`)}
                      disabled={isLoading}
                      className="input-field"
                    />

                    <input
                      type="date"
                      {...register(`education.${index}.endDate`)}
                      disabled={isLoading}
                      className="input-field"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => educationFields.remove(index)}
                    disabled={isLoading}
                    className="mt-3 text-xs text-red-400 hover:text-red-300"
                  >
                    Remove Education
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              EXPERIENCE
          ================================================= */}

          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Experience
              </h3>

              <button
                type="button"
                onClick={() =>
                  experienceFields.append({
                    company: "",
                    designation: "",
                    startDate: null,
                    endDate: null,
                    currentlyWorking: false,
                    description: "",
                  })
                }
                disabled={isLoading}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                + Add Experience
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {experienceFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      {...register(`experience.${index}.company`)}
                      placeholder="Company"
                      disabled={isLoading}
                      className="input-field"
                    />

                    <input
                      {...register(`experience.${index}.designation`)}
                      placeholder="Designation"
                      disabled={isLoading}
                      className="input-field"
                    />

                    <input
                      type="date"
                      {...register(`experience.${index}.startDate`)}
                      disabled={isLoading}
                      className="input-field"
                    />

                    <input
                      type="date"
                      {...register(`experience.${index}.endDate`)}
                      disabled={isLoading}
                      className="input-field"
                    />
                  </div>

                  <label className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                    <input
                      type="checkbox"
                      {...register(`experience.${index}.currentlyWorking`)}
                      disabled={isLoading}
                    />
                    Currently Working
                  </label>

                  <textarea
                    {...register(`experience.${index}.description`)}
                    rows={4}
                    placeholder="Job responsibilities and achievements..."
                    disabled={isLoading}
                    className="input-field mt-4 resize-none"
                  />

                  <button
                    type="button"
                    onClick={() => experienceFields.remove(index)}
                    disabled={isLoading}
                    className="mt-3 text-xs text-red-400 hover:text-red-300"
                  >
                    Remove Experience
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              PROJECTS
          ================================================= */}

          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Projects
              </h3>

              <button
                type="button"
                onClick={() =>
                  projectFields.append({
                    title: "",
                    description: "",
                    technologies: [],
                    github: "",
                    live: "",
                  })
                }
                disabled={isLoading}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                + Add Project
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {projectFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                >
                  <input
                    {...register(`projects.${index}.title`)}
                    placeholder="Project Title"
                    disabled={isLoading}
                    className="input-field"
                  />

                  <textarea
                    {...register(`projects.${index}.description`)}
                    rows={4}
                    placeholder="Project description..."
                    disabled={isLoading}
                    className="input-field mt-4 resize-none"
                  />

                  <input
                    {...register(`projects.${index}.technologies`)}
                    placeholder="React, Node.js, MongoDB"
                    disabled={isLoading}
                    className="input-field mt-4"
                  />
                  
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <input
                      type="url"
                      {...register(`projects.${index}.github`)}
                      placeholder="GitHub URL"
                      disabled={isLoading}
                      className="input-field"
                    />

                    <input
                      type="url"
                      {...register(`projects.${index}.live`)}
                      placeholder="Live URL"
                      disabled={isLoading}
                      className="input-field"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => projectFields.remove(index)}
                    disabled={isLoading}
                    className="mt-3 text-xs text-red-400 hover:text-red-300"
                  >
                    Remove Project
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              CERTIFICATIONS
          ================================================= */}

          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Certifications
              </h3>

              <button
                type="button"
                onClick={() =>
                  certificationFields.append({
                    name: "",
                    organization: "",
                    issueDate: null,
                  })
                }
                disabled={isLoading}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                + Add Certification
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {certificationFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      {...register(`certifications.${index}.name`)}
                      placeholder="Certification Name"
                      disabled={isLoading}
                      className="input-field"
                    />

                    <input
                      {...register(`certifications.${index}.organization`)}
                      placeholder="Organization"
                      disabled={isLoading}
                      className="input-field"
                    />

                    <input
                      type="date"
                      {...register(`certifications.${index}.issueDate`)}
                      disabled={isLoading}
                      className="input-field"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => certificationFields.remove(index)}
                    disabled={isLoading}
                    className="mt-3 text-xs text-red-400 hover:text-red-300"
                  >
                    Remove Certification
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              ACHIEVEMENTS
          ================================================= */}

          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Achievements
              </h3>

              <button
                type="button"
                onClick={() => achievementFields.append("")}
                disabled={isLoading}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                + Add Achievement
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {achievementFields.fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <input
                    {...register(`achievements.${index}`)}
                    placeholder="Achievement"
                    disabled={isLoading}
                    className="input-field flex-1"
                  />

                  <button
                    type="button"
                    onClick={() => achievementFields.remove(index)}
                    disabled={isLoading}
                    className="rounded-lg border border-red-500/20 px-3 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              LANGUAGES
          ================================================= */}

          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Languages
              </h3>

              <button
                type="button"
                onClick={() =>
                  languageFields.append({
                    type: "",
                  })
                }
                disabled={isLoading}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                + Add Language
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {languageFields.fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <input
                    {...register(`languages.${index}.type`)}
                    placeholder="English"
                    disabled={isLoading}
                    className="input-field flex-1"
                  />

                  <button
                    type="button"
                    onClick={() => languageFields.remove(index)}
                    disabled={isLoading}
                    className="rounded-lg border border-red-500/20 px-3 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isParsingResume
                ? "Analyzing Resume..."
                : isUploadingResume
                  ? "Uploading Resume..."
                  : isSubmitting
                    ? "Creating..."
                    : "Create Candidate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCandidateModal;
