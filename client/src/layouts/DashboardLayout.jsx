import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="min-h-screen bg-slate-950 md:ml-64">
        <Navbar />

        <main className="min-h-[calc(100vh-4rem)] bg-slate-950 p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
