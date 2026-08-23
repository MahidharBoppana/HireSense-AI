import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const editJobSchema = z
  .object({
    title: z.string().trim().min(2, "Job title must be at least 2 characters"),

    company: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters"),

    department: z.string().trim().min(2, "Department is required"),

    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters"),

    requiredSkills: z.string().trim().min(1, "Add at least one required skill"),

    preferredSkills: z.string().optional(),

    minExperience: z.coerce
      .number()
      .min(0, "Minimum experience cannot be negative"),

    maxExperience: z.coerce
      .number()
      .min(0, "Maximum experience cannot be negative"),

    salaryMin: z.coerce.number().min(0, "Minimum salary cannot be negative"),

    salaryMax: z.coerce.number().min(0, "Maximum salary cannot be negative"),

    currency: z.string().min(1, "Currency is required"),

    location: z.string().trim().min(2, "Location is required"),

    employmentType: z.enum([
      "full_time",
      "part_time",
      "contract",
      "internship",
      "remote",
      "hybrid",
    ]),

    hiringManager: z.string().optional(),

    status: z.enum(["draft", "open", "closed"]),
  })
  .superRefine((data, ctx) => {
    if (data.maxExperience < data.minExperience) {
      ctx.addIssue({
        code: "custom",
        message:
          "Maximum experience must be greater than or equal to minimum experience",
        path: ["maxExperience"],
      });
    }

    if (data.salaryMax < data.salaryMin) {
      ctx.addIssue({
        code: "custom",
        message:
          "Maximum salary must be greater than or equal to minimum salary",
        path: ["salaryMax"],
      });
    }
  });

function EditJobModal({
  isOpen,
  onClose,
  onSubmit,
  job,
  hiringManagers = [],
  isSubmitting,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editJobSchema),

    defaultValues: {
      title: "",
      company: "",
      department: "",
      description: "",
      requiredSkills: "",
      preferredSkills: "",
      minExperience: 0,
      maxExperience: 0,
      salaryMin: 0,
      salaryMax: 0,
      currency: "INR",
      location: "",
      employmentType: "full_time",
      hiringManager: "",
      status: "draft",
    },
  });

  /*
   * Load existing job data into the form
   */

  useEffect(() => {
    if (!isOpen || !job) {
      return;
    }

    reset({
      title: job.title || "",

      company: job.company || "",

      department: job.department || "",

      description: job.description || "",

      requiredSkills: Array.isArray(job.requiredSkills)
        ? job.requiredSkills.join(", ")
        : "",

      preferredSkills: Array.isArray(job.preferredSkills)
        ? job.preferredSkills.join(", ")
        : "",

      minExperience: job.experience?.min ?? 0,

      maxExperience: job.experience?.max ?? 0,

      salaryMin: job.salary?.min ?? 0,

      salaryMax: job.salary?.max ?? 0,

      currency: job.salary?.currency || "INR",

      location: job.location || "",

      employmentType: job.employmentType || "full_time",

      hiringManager:
        typeof job.hiringManager === "object"
          ? job.hiringManager?._id || ""
          : job.hiringManager || "",

      status: job.status || "draft",
    });
  }, [isOpen, job, reset]);

  /*
   * Close modal
   */

  const handleClose = () => {
    reset();
    onClose();
  };

  /*
   * Submit form
   */

  const submitForm = (data) => {
    const requiredSkills = data.requiredSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const preferredSkills = data.preferredSkills
      ? data.preferredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

    const jobData = {
      title: data.title.trim(),

      company: data.company.trim(),

      department: data.department.trim(),

      description: data.description.trim(),

      requiredSkills,

      preferredSkills,

      experience: {
        min: data.minExperience,
        max: data.maxExperience,
      },

      salary: {
        min: data.salaryMin,
        max: data.salaryMax,
        currency: data.currency,
      },

      location: data.location.trim(),

      employmentType: data.employmentType,

      hiringManager: data.hiringManager || null,

      status: data.status,
    };

    onSubmit(jobData);
  };

  if (!isOpen || !job) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Edit Job</h2>

            <p className="mt-1 text-sm text-slate-400">
              Update the job opening and recruitment requirements.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit(submitForm)} className="space-y-6 p-6">
          {/* Basic Information */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Basic Information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Title */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Job Title
                </label>

                <input
                  type="text"
                  {...register("title")}
                  disabled={isSubmitting}
                  placeholder="MERN Stack Developer"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />

                {errors.title && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Company */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Company
                </label>

                <input
                  type="text"
                  {...register("company")}
                  disabled={isSubmitting}
                  placeholder="HireSense Technologies"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />

                {errors.company && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.company.message}
                  </p>
                )}
              </div>

              {/* Department */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Department
                </label>

                <input
                  type="text"
                  {...register("department")}
                  disabled={isSubmitting}
                  placeholder="Engineering"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />

                {errors.department && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.department.message}
                  </p>
                )}
              </div>

              {/* Location */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Location
                </label>

                <input
                  type="text"
                  {...register("location")}
                  disabled={isSubmitting}
                  placeholder="Hyderabad"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />

                {errors.location && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Job Description
            </label>

            <textarea
              {...register("description")}
              rows={5}
              disabled={isSubmitting}
              placeholder="Describe the responsibilities, requirements, and expectations..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
            />

            {errors.description && (
              <p className="mt-1 text-xs text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Skills */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Skills
            </h3>

            <div className="mt-4 space-y-4">
              {/* Required */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Required Skills
                </label>

                <input
                  type="text"
                  {...register("requiredSkills")}
                  disabled={isSubmitting}
                  placeholder="React, Node.js, MongoDB, Express.js"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Separate skills with commas.
                </p>

                {errors.requiredSkills && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.requiredSkills.message}
                  </p>
                )}
              </div>

              {/* Preferred */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Preferred Skills
                </label>

                <input
                  type="text"
                  {...register("preferredSkills")}
                  disabled={isSubmitting}
                  placeholder="Docker, AWS, TypeScript"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Optional. Separate skills with commas.
                </p>
              </div>
            </div>
          </div>

          {/* Experience */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Experience
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Minimum Experience (Years)
                </label>

                <input
                  type="number"
                  min="0"
                  {...register("minExperience")}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-50"
                />

                {errors.minExperience && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.minExperience.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Maximum Experience (Years)
                </label>

                <input
                  type="number"
                  min="0"
                  {...register("maxExperience")}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-50"
                />

                {errors.maxExperience && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.maxExperience.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Salary */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Salary
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Minimum Salary
                </label>

                <input
                  type="number"
                  min="0"
                  {...register("salaryMin")}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-50"
                />

                {errors.salaryMin && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.salaryMin.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Maximum Salary
                </label>

                <input
                  type="number"
                  min="0"
                  {...register("salaryMax")}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-50"
                />

                {errors.salaryMax && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.salaryMax.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Currency
                </label>

                <select
                  {...register("currency")}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500 disabled:opacity-50"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employment */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Employment
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Employment Type */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Employment Type
                </label>

                <select
                  {...register("employmentType")}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500 disabled:opacity-50"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Hiring Manager */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Hiring Manager
                </label>

                <select
                  {...register("hiringManager")}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500 disabled:opacity-50"
                >
                  <option value="">Not Assigned</option>

                  {hiringManagers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.firstName} {manager.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Status
            </label>

            <select
              {...register("status")}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500 disabled:opacity-50"
            >
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Actions */}

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJobModal;
