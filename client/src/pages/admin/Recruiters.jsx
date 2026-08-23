import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  getRecruiters,
  createRecruiter,
  updateRecruiter,
  updateRecruiterStatus,
  deleteRecruiter,
} from "../../services/user.service";

import CreateRecruiterModal from "../../components/modals/CreateRecruiterModal";
import EditRecruiterModal from "../../components/modals/EditRecruiterModal";
import DeleteRecruiterModal from "../../components/modals/DeleteRecruiterModal";

function Recruiters() {
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);

  const queryClient = useQueryClient();

  // Get recruiters

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-recruiters"],
    queryFn: getRecruiters,
  });

  // Create recruiter

  const createRecruiterMutation = useMutation({
    mutationFn: createRecruiter,

    onSuccess: (response) => {
      toast.success(response?.message || "Recruiter created successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-recruiters"],
      });

      setIsCreateModalOpen(false);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create recruiter",
      );
    },
  });

  // Update recruiter

  const updateRecruiterMutation = useMutation({
    mutationFn: updateRecruiter,

    onSuccess: (response) => {
      toast.success(response?.message || "Recruiter updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-recruiters"],
      });

      setIsEditModalOpen(false);
      setSelectedRecruiter(null);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update recruiter",
      );
    },
  });

  // Update recruiter status

  const updateRecruiterStatusMutation = useMutation({
    mutationFn: updateRecruiterStatus,

    onSuccess: (response) => {
      toast.success(
        response?.message || "Recruiter status updated successfully",
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-recruiters"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update recruiter status",
      );
    },
  });

  // Delete recruiter

  const deleteRecruiterMutation = useMutation({
    mutationFn: deleteRecruiter,

    onSuccess: (response) => {
      toast.success(response?.message || "Recruiter deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-recruiters"],
      });

      setIsDeleteModalOpen(false);
      setSelectedRecruiter(null);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete recruiter",
      );
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[500px] rounded-2xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

            <p className="mt-4 text-sm text-slate-400">Loading recruiters...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Unable to load recruiters
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            "Something went wrong while loading recruiters."}
        </p>
      </div>
    );
  }

  const recruiters = response?.data || [];

  const activeRecruiters = recruiters.filter(
    (recruiter) => recruiter.isActive,
  ).length;

  const inactiveRecruiters = recruiters.filter(
    (recruiter) => !recruiter.isActive,
  ).length;

  const filteredRecruiters = recruiters.filter((recruiter) => {
    const searchTerm = search.toLowerCase().trim();

    if (!searchTerm) {
      return true;
    }

    const fullName =
      `${recruiter.firstName || ""} ${recruiter.lastName || ""}`.toLowerCase();

    const email = recruiter.email?.toLowerCase() || "";

    return fullName.includes(searchTerm) || email.includes(searchTerm);
  });

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-400">User Management</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Recruiters
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Manage recruiter accounts and control their access to the HireSense
            AI platform.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          + Create Recruiter
        </button>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Recruiters</p>

          <p className="mt-3 text-3xl font-bold text-white">
            {recruiters.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Active</p>

          <p className="mt-3 text-3xl font-bold text-emerald-400">
            {activeRecruiters}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Inactive</p>

          <p className="mt-3 text-3xl font-bold text-red-400">
            {inactiveRecruiters}
          </p>
        </div>
      </div>

      {/* Recruiter Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-white">Recruiter Accounts</h2>

            <p className="mt-1 text-sm text-slate-500">
              All recruiters managed by administrators.
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search recruiters..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-slate-950/70">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Recruiter
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Created
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {filteredRecruiters.map((recruiter) => (
                <tr
                  key={recruiter._id}
                  className="transition hover:bg-slate-800/40"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 font-semibold text-indigo-400">
                        {recruiter.firstName?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-white">
                          {recruiter.firstName} {recruiter.lastName}
                        </p>

                        <p className="text-xs text-slate-500">Recruiter</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {recruiter.email}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                        recruiter.isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          recruiter.isActive ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />

                      {recruiter.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {recruiter.createdAt
                      ? new Date(recruiter.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedRecruiter(recruiter);
                          setIsEditModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          updateRecruiterStatusMutation.mutate({
                            recruiterId: recruiter._id,
                            isActive: !recruiter.isActive,
                          })
                        }
                        disabled={updateRecruiterStatusMutation.isPending}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          recruiter.isActive
                            ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                            : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {updateRecruiterStatusMutation.isPending
                          ? "Updating..."
                          : recruiter.isActive
                            ? "Deactivate"
                            : "Activate"}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedRecruiter(recruiter);
                          setIsDeleteModalOpen(true);
                        }}
                        className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecruiters.length === 0 && (
          <div className="px-6 py-16 text-center">
            <h3 className="font-semibold text-white">
              {search ? "No recruiters found" : "No recruiters yet"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try searching with a different name or email."
                : "Create your first recruiter to get started."}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}

      <CreateRecruiterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createRecruiterMutation.mutate(data)}
        isSubmitting={createRecruiterMutation.isPending}
      />

      <EditRecruiterModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRecruiter(null);
        }}
        recruiter={selectedRecruiter}
        onSubmit={(data) =>
          updateRecruiterMutation.mutate({
            recruiterId: selectedRecruiter._id,
            data,
          })
        }
        isSubmitting={updateRecruiterMutation.isPending}
      />

      <DeleteRecruiterModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRecruiter(null);
        }}
        recruiter={selectedRecruiter}
        onConfirm={() => deleteRecruiterMutation.mutate(selectedRecruiter._id)}
        isDeleting={deleteRecruiterMutation.isPending}
      />
    </div>
  );
}

export default Recruiters;
