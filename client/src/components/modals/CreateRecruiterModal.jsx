import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createRecruiterSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),

    email: z.string().trim().email("Enter a valid email address"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function CreateRecruiterModal({ isOpen, onClose, onSubmit, isSubmitting }) {
    const [allowInput, setAllowInput] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createRecruiterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setAllowInput(false);

      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } else {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitForm = (data) => {
    const { confirmPassword, ...recruiterData } = data;

    onSubmit(recruiterData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Create Recruiter
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Create a new recruiter account.
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

        <form
          onSubmit={handleSubmit(submitForm)}
          autoComplete="off"
          className="space-y-5 p-6"
        >
          {/* First + Last Name */}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                First Name
              </label>

              <input
                type="text"
                {...register("firstName")}
                placeholder="John"
                autoComplete="off"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
              />

              {errors.firstName && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Last Name
              </label>

              <input
                type="text"
                {...register("lastName")}
                autoComplete="off"
                placeholder="Doe"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
              />

              {errors.lastName && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              placeholder="recruiter@hiresense.ai"
              autoComplete="off"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <input
              type="password"
              {...register("password")}
              autoComplete="off"
              placeholder="Minimum 8 characters"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
            />

            {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Confirm Password
            </label>

            <input
              type="password"
              {...register("confirmPassword")}
              autoComplete="off"
              placeholder="Re-enter password"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
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
              {isSubmitting ? "Creating..." : "Create Recruiter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRecruiterModal;
