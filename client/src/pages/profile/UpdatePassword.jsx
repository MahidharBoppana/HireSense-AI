import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../../services/auth.service";

const UpdatePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const mutation = useMutation({
    mutationFn: updatePassword,

    onSuccess: () => {
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      return;
    }

    mutation.mutate({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500";

  const EyeIcon = ({ show }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="h-5 w-5"
    >
      {show ? (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.21.07.434 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </>
      ) : (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.16 7.16 19.5 12 19.5c1.69 0 3.286-.404 4.696-1.12"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.228 6.228A10.45 10.45 0 0112 4.5c4.84 0 8.774 3.34 10.066 7.5a10.45 10.45 0 01-4.132 5.472M6.228 6.228L3 3m3.228 3.228l3.484 3.484m7.156 7.156L21 21m-4.132-4.132l-3.484-3.484"
          />
        </>
      )}
    </svg>
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-400">Account Security</p>

        <h1 className="mt-1 text-3xl font-bold text-white">Update Password</h1>

        <p className="mt-2 text-sm text-slate-400">
          Change your account password.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter current password"
                required
              />

              <button
                type="button"
                onClick={() => setShowCurrent((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <EyeIcon show={showCurrent} />
              </button>
            </div>
          </div>

          {/* New Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              New Password
            </label>

            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter new password"
                minLength={8}
                required
              />

              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <EyeIcon show={showNew} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder="Confirm new password"
                minLength={8}
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <EyeIcon show={showConfirm} />
              </button>
            </div>
          </div>

          {form.confirmPassword &&
            form.newPassword !== form.confirmPassword && (
              <p className="text-sm text-red-400">Passwords do not match.</p>
            )}

          {mutation.isError && (
            <p className="text-sm text-red-400">
              {mutation.error?.response?.data?.message ||
                "Failed to update password."}
            </p>
          )}

          {mutation.isSuccess && (
            <p className="text-sm text-emerald-400">
              Password updated successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={
              mutation.isPending || form.newPassword !== form.confirmPassword
            }
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
