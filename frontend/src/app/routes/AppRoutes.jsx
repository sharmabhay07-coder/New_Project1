import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import BlankLayout from "../layouts/BlankLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import Home from "../../pages/home/Home";
import Auth from "../../pages/auth/Auth";

// Dashboard Pages
import Dashboard from "../../pages/dashboard/Dashboard";
// import Activity from "../../pages/dashboard/activity/Activity";
// import Stats from "../../pages/dashboard/stats/Stats";
// import Tasks from "../../pages/dashboard/tasks/Tasks";

const router = createBrowserRouter([
  // ==========================
  // Public Layout
  // ==========================
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },

  // ==========================
  // Auth Layout
  // ==========================
  {
    element: <BlankLayout />,
    children: [
      {
        path: "/auth",
        element: <Auth />,
      },
    ],
  },
  

  // ==========================
  // Dashboard Layout
  // ==========================
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ]
  },
]);

export default router;