import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getCandidates,
  deleteCandidate,
} from "../../services/candidate.service";

import { createCandidate } from "../../services/candidate.service";
import CreateCandidateModal from "../../components/modals/CreateCandidateModal";

function Candidates() {
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    candidateId: null,
    candidateName: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get Candidates
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recruiter-candidates", { search }],

    queryFn: () =>
      getCandidates({
        search: search || undefined,
      }),
  });

  const createCandidateMutation = useMutation({
    mutationFn: createCandidate,

    onSuccess: (response) => {
      toast.success(response?.message || "Candidate created successfully");

      queryClient.invalidateQueries({
        queryKey: ["recruiter-candidates"],
      });

      setIsCreateModalOpen(false);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create candidate",
      );
    },
  });

  // Delete Candidate
  const deleteCandidateMutation = useMutation({
    mutationFn: deleteCandidate,

    onSuccess: (response) => {
      toast.success(response?.message || "Candidate deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["recruiter-candidates"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete candidate",
      );
    },
  });

  const handleDelete = (candidateId, candidateName) => {
    setDeleteModal({
      isOpen: true,
      candidateId,
      candidateName,
    });
  };

  const confirmDelete = () => {
    if (!deleteModal.candidateId) return;

    deleteCandidateMutation.mutate(deleteModal.candidateId, {
      onSuccess: () => {
        setDeleteModal({
          isOpen: false,
          candidateId: null,
          candidateName: "",
        });
      },
    });
  };

  const closeDeleteModal = () => {
    if (deleteCandidateMutation.isPending) return;

    setDeleteModal({
      isOpen: false,
      candidateId: null,
      candidateName: "",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] rounded-2xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

            <p className="mt-4 text-sm text-slate-400">Loading candidates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400">
          Unable to load candidates
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            "Something went wrong while loading candidates."}
        </p>
      </div>
    );
  }

  const candidates = response?.data || [];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-400">
            Candidate Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Candidates
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Manage candidate profiles and review their recruitment information.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          + Add Candidate
        </button>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Candidates</p>

          <p className="mt-3 text-3xl font-bold text-white">
            {candidates.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">With Resume</p>

          <p className="mt-3 text-3xl font-bold text-emerald-400">
            {candidates.filter((candidate) => candidate.resumeUrl).length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Average Experience</p>

          <p className="mt-3 text-3xl font-bold text-indigo-400">
            {candidates.length > 0
              ? (
                  candidates.reduce(
                    (total, candidate) =>
                      total + (candidate.totalExperience || 0),
                    0,
                  ) / candidates.length
                ).toFixed(1)
              : "0.0"}{" "}
            <span className="text-base font-medium text-slate-500">years</span>
          </p>
        </div>
      </div>

      {/* Candidates */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {/* Filters */}

        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-white">Candidate Profiles</h2>

            <p className="mt-1 text-sm text-slate-500">
              Candidates managed by you.
            </p>
          </div>

          <div>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search candidates..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 sm:w-72"
            />
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-slate-950/70">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Candidate
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contact
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Skills
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Experience
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Resume
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {candidates.map((candidate) => (
                <tr
                  key={candidate._id}
                  className="transition hover:bg-slate-800/40"
                >
                  {/* Candidate */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 font-semibold text-indigo-400">
                        {candidate.fullName?.charAt(0)?.toUpperCase() || "C"}
                      </div>

                      <div>
                        <p className="font-medium text-white">
                          {candidate.fullName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {candidate.location || "Location not specified"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}

                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-300">{candidate.email}</p>

                    <p className="mt-1 text-xs text-slate-500">
                      {candidate.phone || "No phone number"}
                    </p>
                  </td>

                  {/* Skills */}

                  <td className="px-6 py-4">
                    <div className="flex max-w-[250px] flex-wrap gap-1.5">
                      {candidate.skills?.length > 0 ? (
                        candidate.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-600">
                          No skills
                        </span>
                      )}

                      {candidate.skills?.length > 3 && (
                        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-500">
                          +{candidate.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Experience */}

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {candidate.totalExperience !== undefined
                      ? `${candidate.totalExperience} years`
                      : "Not specified"}
                  </td>

                  {/* Resume */}

                  <td className="px-6 py-4">
                    {candidate.resumeUrl ? (
                      <a
                        href={candidate.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
                      >
                        View Resume
                      </a>
                    ) : (
                      <span className="text-sm text-slate-600">
                        Not uploaded
                      </span>
                    )}
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/recruiter/candidates/${candidate._id}`)
                        }
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/recruiter/candidates/${candidate._id}/edit`,
                          )
                        }
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            candidate._id,
                            candidate.fullName || "this candidate",
                          )
                        }
                        disabled={deleteCandidateMutation.isPending}
                        className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
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

        {candidates.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-xl text-slate-500">
              C
            </div>

            <h3 className="mt-4 font-semibold text-white">
              No candidates found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add your first candidate to get started.
            </p>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              + Add Candidate
            </button>
          </div>
        )}
      </div>
      <CreateCandidateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createCandidateMutation.mutate(data)}
        isSubmitting={createCandidateMutation.isPending}
      />
      {/* Delete Confirmation Modal */}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            {/* Icon */}

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                />
              </svg>
            </div>

            {/* Content */}

            <h2 className="mt-5 text-xl font-semibold text-white">
              Delete Candidate
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-white">
                {deleteModal.candidateName}
              </span>
              ?
            </p>

            <p className="mt-2 text-xs text-slate-500">
              This candidate will be removed from your candidate list.
            </p>

            {/* Actions */}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteCandidateMutation.isPending}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteCandidateMutation.isPending}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteCandidateMutation.isPending
                  ? "Deleting..."
                  : "Delete Candidate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Candidates;
