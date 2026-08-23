import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  getHiringManagers,
  createHiringManager,
  updateHiringManager,
  updateHiringManagerStatus,
  deleteHiringManager,
} from "../../services/user.service";

import CreateHiringManagerModal from "../../components/modals/CreateHiringManagerModal";
import EditHiringManagerModal from "../../components/modals/EditHiringManagerModal";
import DeleteHiringManagerModal from "../../components/modals/DeleteHiringManagerModal";

function HiringManagers() {
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHiringManager, setSelectedHiringManager] = useState(null);

  const queryClient = useQueryClient();

  // Get hiring managers

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-hiring-managers"],
    queryFn: getHiringManagers,
  });

  // Create hiring manager

  const createHiringManagerMutation = useMutation({
    mutationFn: createHiringManager,

    onSuccess: (response) => {
      toast.success(response?.message || "Hiring manager created successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-hiring-managers"],
      });

      setIsCreateModalOpen(false);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create hiring manager",
      );
    },
  });

  // Update hiring manager

  const updateHiringManagerMutation = useMutation({
    mutationFn: updateHiringManager,

    onSuccess: (response) => {
      toast.success(response?.message || "Hiring manager updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-hiring-managers"],
      });

      setIsEditModalOpen(false);
      setSelectedHiringManager(null);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update hiring manager",
      );
    },
  });

  // Update status

  const updateHiringManagerStatusMutation = useMutation({
    mutationFn: updateHiringManagerStatus,

    onSuccess: (response) => {
      toast.success(
        response?.message || "Hiring manager status updated successfully",
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-hiring-managers"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update hiring manager status",
      );
    },
  });

  // Delete hiring manager

  const deleteHiringManagerMutation = useMutation({
    mutationFn: deleteHiringManager,

    onSuccess: (response) => {
      toast.success(response?.message || "Hiring manager deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-hiring-managers"],
      });

      setIsDeleteModalOpen(false);
      setSelectedHiringManager(null);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete hiring manager",
      );
    },
  });

  // Loading

  if (isLoading) {
    return (
      <div className="min-h-[500px] rounded-2xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

            <p className="mt-4 text-sm text-slate-400">
              Loading hiring managers...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Unable to load hiring managers
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            "Something went wrong while loading hiring managers."}
        </p>
      </div>
    );
  }

  const hiringManagers = response?.data || [];

  const activeHiringManagers = hiringManagers.filter(
    (manager) => manager.isActive,
  ).length;

  const inactiveHiringManagers = hiringManagers.filter(
    (manager) => !manager.isActive,
  ).length;

  const filteredHiringManagers = hiringManagers.filter((manager) => {
    const searchTerm = search.toLowerCase().trim();

    if (!searchTerm) {
      return true;
    }

    const fullName =
      `${manager.firstName || ""} ${manager.lastName || ""}`.toLowerCase();

    const email = manager.email?.toLowerCase() || "";

    return fullName.includes(searchTerm) || email.includes(searchTerm);
  });

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-400">User Management</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Hiring Managers
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Manage hiring manager accounts and control their access to the
            HireSense AI platform.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          + Create Hiring Manager
        </button>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Hiring Managers</p>

          <p className="mt-3 text-3xl font-bold text-white">
            {hiringManagers.length}
          </p>
        </div>

        {/* Active */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Active</p>

          <p className="mt-3 text-3xl font-bold text-emerald-400">
            {activeHiringManagers}
          </p>
        </div>

        {/* Inactive */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Inactive</p>

          <p className="mt-3 text-3xl font-bold text-red-400">
            {inactiveHiringManagers}
          </p>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {/* Table Header */}

        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-white">
              Hiring Manager Accounts
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              All hiring managers managed by administrators.
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search hiring managers..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 sm:w-64"
          />
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-slate-950/70">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Hiring Manager
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
              {filteredHiringManagers.map((manager) => (
                <tr
                  key={manager._id}
                  className="transition hover:bg-slate-800/40"
                >
                  {/* Hiring Manager */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 font-semibold text-indigo-400">
                        {manager.firstName?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-white">
                          {manager.firstName} {manager.lastName}
                        </p>

                        <p className="text-xs text-slate-500">Hiring Manager</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {manager.email}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                        manager.isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          manager.isActive ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />

                      {manager.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Created */}

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {manager.createdAt
                      ? new Date(manager.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Edit */}

                      <button
                        onClick={() => {
                          setSelectedHiringManager(manager);
                          setIsEditModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                      >
                        Edit
                      </button>

                      {/* Activate / Deactivate */}

                      <button
                        onClick={() =>
                          updateHiringManagerStatusMutation.mutate({
                            hiringManagerId: manager._id,
                            isActive: !manager.isActive,
                          })
                        }
                        disabled={updateHiringManagerStatusMutation.isPending}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          manager.isActive
                            ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                            : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {updateHiringManagerStatusMutation.isPending
                          ? "Updating..."
                          : manager.isActive
                            ? "Deactivate"
                            : "Activate"}
                      </button>

                      {/* Delete */}

                      <button
                        onClick={() => {
                          setSelectedHiringManager(manager);
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

        {/* Empty State */}

        {filteredHiringManagers.length === 0 && (
          <div className="px-6 py-16 text-center">
            <h3 className="font-semibold text-white">
              {search ? "No hiring managers found" : "No hiring managers yet"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try searching with a different name or email."
                : "Create your first hiring manager to get started."}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}

      <CreateHiringManagerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createHiringManagerMutation.mutate(data)}
        isSubmitting={createHiringManagerMutation.isPending}
      />

      <EditHiringManagerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedHiringManager(null);
        }}
        hiringManager={selectedHiringManager}
        onSubmit={(data) =>
          updateHiringManagerMutation.mutate({
            hiringManagerId: selectedHiringManager._id,
            data,
          })
        }
        isSubmitting={updateHiringManagerMutation.isPending}
      />

      <DeleteHiringManagerModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedHiringManager(null);
        }}
        hiringManager={selectedHiringManager}
        onConfirm={() =>
          deleteHiringManagerMutation.mutate(selectedHiringManager._id)
        }
        isDeleting={deleteHiringManagerMutation.isPending}
      />
    </div>
  );
}

export default HiringManagers;
