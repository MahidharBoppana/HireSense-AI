import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/95 px-6 backdrop-blur">
      {/* Page area */}

      <div>
        <p className="text-sm text-slate-400">Welcome back</p>

        <p className="font-semibold text-white">{fullName}</p>
      </div>

      {/* User */}

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-semibold">
          {user?.firstName?.charAt(0)?.toUpperCase()}
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-medium text-white">{fullName}</p>

          <p className="text-xs capitalize text-slate-400">
            {user?.role?.replace("_", " ")}
          </p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
