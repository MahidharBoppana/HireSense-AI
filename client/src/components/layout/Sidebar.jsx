import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();

  const role = user?.role;

  const navigation = {
    super_admin: [
      {
        name: "Dashboard",
        path: "/super-admin/dashboard",
      },
      {
        name: "Admins",
        path: "/super-admin/admins",
      },
      {
        name: "Recruiters",
        path: "/super-admin/recruiters",
      },
    ],

    admin: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
      },
    ],

    recruiter: [
      {
        name: "Dashboard",
        path: "/recruiter/dashboard",
      },
    ],

    hiring_manager: [
      {
        name: "Dashboard",
        path: "/hiring-manager/dashboard",
      },
    ],
  };

  const links = navigation[role] || [];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 bg-slate-900">
      {/* Logo */}

      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <h1 className="text-xl font-bold text-white">
          HireSense <span className="text-indigo-500">AI</span>
        </h1>
      </div>

      {/* Navigation */}

      <nav className="p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </p>

        <div className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
