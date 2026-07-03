import { Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import Topbar from "../../components/dashboard/topbar/Topbar";
// import Sidebar from "../../components/dashboard/sidebar/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      {/* <Sidebar /> */}

      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}