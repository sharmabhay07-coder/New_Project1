import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import BlankLayout from "../layouts/BlankLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../../pages/home/Home";
import Auth from "../../pages/auth/Auth";
import Dashboard from "../../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
    ],
  },
  {
    element: <BlankLayout />,
    children: [
      { path: "/auth", element: <Auth /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "videos", element: <div style={{ padding: 24 }}>Videos coming soon.</div> },
          { path: "wallet", element: <div style={{ padding: 24 }}>Wallet section coming soon.</div> },
          { path: "referrals", element: <div style={{ padding: 24 }}>Referrals section coming soon.</div> },
        ],
      },
    ],
  },
]);

export default router;