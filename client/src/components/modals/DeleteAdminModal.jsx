function DeleteAdminModal({ isOpen, onClose, onConfirm, admin, isDeleting }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Content */}

        <div className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-xl text-red-400">
            !
          </div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            Delete Administrator?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-medium text-white">
              {admin?.firstName} {admin?.lastName}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Actions */}

        <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAdminModal;
