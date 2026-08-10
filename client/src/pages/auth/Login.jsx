import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { login } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),

  password: z.string().min(1, "Password is required"),
});

function Login() {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      const user = response.data.user;

      setUser(user);

      toast.success("Logged in successfully");

      switch (user.role) {
        case "super_admin":
          navigate("/super-admin/dashboard");
          break;

        case "admin":
          navigate("/admin/dashboard");
          break;

        case "recruiter":
          navigate("/recruiter/dashboard");
          break;

        case "hiring_manager":
          navigate("/hiring-manager/dashboard");
          break;

        default:
          navigate("/");
      }
    },

    onError: (error) => {
      const message =
        error.response?.data?.message || "Unable to login. Please try again.";

      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">HireSense AI</h1>

          <p className="mt-2 text-slate-400">AI-powered recruitment platform</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Welcome back</h2>

            <p className="mt-1 text-sm text-slate-400">
              Sign in to continue to your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                disabled={loginMutation.isPending}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                disabled={loginMutation.isPending}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
