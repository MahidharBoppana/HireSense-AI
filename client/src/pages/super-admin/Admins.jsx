import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  getAdmins,
  createAdmin,
  updateAdmin,
  updateAdminStatus,
  deleteAdmin,
} from "../../services/user.service";

import CreateAdminModal from "../../components/modals/CreateAdminModal";
import EditAdminModal from "../../components/modals/EditAdminModal";
import DeleteAdminModal from "../../components/modals/DeleteAdminModal";

function Admins() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const queryClient = useQueryClient();

  const createAdminMutation = useMutation({
    mutationFn: createAdmin,

    onSuccess: (response) => {
      toast.success(response?.message || "Admin created successfully");

      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });

      setIsCreateModalOpen(false);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create admin");
    },
  });

  const updateAdminMutation = useMutation({
    mutationFn: updateAdmin,

    onSuccess: (response) => {
      toast.success(response?.message || "Admin updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });

      setIsEditModalOpen(false);
      setSelectedAdmin(null);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update admin");
    },
  });

  const updateAdminStatusMutation = useMutation({
    mutationFn: updateAdminStatus,

    onSuccess: (response) => {
      toast.success(response?.message || "Admin status updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update admin status",
      );
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: deleteAdmin,

    onSuccess: (response) => {
      toast.success(response?.message || "Admin deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });

      setIsDeleteModalOpen(false);
      setSelectedAdmin(null);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete admin");
    },
  });

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
  });

  if (isLoading) {
    return (
      <div className="min-h-[500px] rounded-2xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

            <p className="mt-4 text-sm text-slate-400">
              Loading administrators...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Unable to load administrators
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            "Something went wrong while loading administrators."}
        </p>
      </div>
    );
  }

  const admins = response?.data || [];

  const filteredAdmins = admins.filter((admin) => {
    const searchTerm = search.toLowerCase().trim();

    if (!searchTerm) {
      return true;
    }

    const fullName =
      `${admin.firstName || ""} ${admin.lastName || ""}`.toLowerCase();

    const email = admin.email?.toLowerCase() || "";

    return fullName.includes(searchTerm) || email.includes(searchTerm);
  });

  const activeAdmins = admins.filter((admin) => admin.isActive).length;

  const inactiveAdmins = admins.filter((admin) => !admin.isActive).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-400">User Management</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Administrators
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Manage administrator accounts and control their access to the
            HireSense AI platform.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          + Create Admin
        </button>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Administrators</p>

              <p className="mt-3 text-3xl font-bold text-white">
                {admins.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400">
              A
            </div>
          </div>
        </div>

        {/* Active */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Active</p>

              <p className="mt-3 text-3xl font-bold text-white">
                {activeAdmins}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-lg text-emerald-400">
              ✓
            </div>
          </div>
        </div>

        {/* Inactive */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Inactive</p>

              <p className="mt-3 text-3xl font-bold text-white">
                {inactiveAdmins}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-lg text-red-400">
              !
            </div>
          </div>
        </div>
      </div>

      {/* Admin Table Card */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
        {/* Table Header */}

        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-white">Administrator Accounts</h2>

            <p className="mt-1 text-sm text-slate-500">
              All administrators registered in the system.
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search administrators..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 sm:w-64"
          />
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-slate-950/70">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Administrator
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
              {filteredAdmins.map((admin) => (
                <tr
                  key={admin._id}
                  className="transition hover:bg-slate-800/40"
                >
                  {/* Administrator */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 font-semibold text-indigo-400">
                        {admin.firstName?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-white">
                          {admin.firstName} {admin.lastName}
                        </p>

                        <p className="text-xs text-slate-500">Administrator</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {admin.email}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                        admin.isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          admin.isActive ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />

                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Created */}

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {admin.createdAt
                      ? new Date(admin.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setIsEditModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          updateAdminStatusMutation.mutate({
                            adminId: admin._id,
                            isActive: !admin.isActive,
                          })
                        }
                        disabled={updateAdminStatusMutation.isPending}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          admin.isActive
                            ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                            : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {updateAdminStatusMutation.isPending
                          ? "Updating..."
                          : admin.isActive
                            ? "Deactivate"
                            : "Activate"}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
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

        {/* Empty */}

        {filteredAdmins.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-xl text-slate-500">
              A
            </div>

            <h3 className="mt-4 font-semibold text-white">
              {search ? "No administrators found" : "No administrators yet"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try searching with a different name or email."
                : "Create your first administrator to get started."}
            </p>
          </div>
        )}
      </div>
      <CreateAdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createAdminMutation.mutate(data)}
        isSubmitting={createAdminMutation.isPending}
      />
      <EditAdminModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        onSubmit={(data) =>
          updateAdminMutation.mutate({
            adminId: selectedAdmin._id,
            data,
          })
        }
        isSubmitting={updateAdminMutation.isPending}
      />
      <DeleteAdminModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        onConfirm={() => {
          deleteAdminMutation.mutate(selectedAdmin._id);
        }}
        isDeleting={deleteAdminMutation.isPending}
      />
    </div>
  );
}

export default Admins;
