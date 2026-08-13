import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../../layouts/MainLayout';
import BlankLayout from '../../layouts/BlankLayout';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../../layouts/DashboardLayout';

// Eagerly load Home and Auth (entry pages)
import Home from '../../pages/home/Home';
import Auth from '../../pages/auth/Auth';

// Lazy-load all other pages
const SelectionPage = lazy(() => import('../../pages/selection/SelectionPage'));
const PlansPage = lazy(() => import('../../pages/plans/PlansPage'));
const Dashboard = lazy(() => import('../../pages/dashboard/Dashboard'));
const VideosPage = lazy(() => import('../../pages/dashboard/videos/VideosPage'));
const WalletPage = lazy(() => import('../../pages/dashboard/wallet/WalletPage'));
const ReferralsPage = lazy(() => import('../../pages/dashboard/referrals/ReferralsPage'));
const TasksPage = lazy(() => import('../../pages/dashboard/tasks/TasksPage'));
const LeaderboardPage = lazy(() => import('../../pages/dashboard/LeaderboardPage'));
const SettingsPage = lazy(() => import('../../pages/dashboard/SettingsPage'));

// Minimal skeleton shown while a lazy page loads
function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
    </div>
  );
}

function SuspenseWrapper({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
    ],
  },
  {
    element: <BlankLayout />,
    children: [
      { path: '/auth', element: <Auth /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/selection',
        element: <BlankLayout />,
        children: [
          { index: true, element: <SuspenseWrapper><SelectionPage /></SuspenseWrapper> },
        ],
      },
      {
        path: '/plans',
        element: <MainLayout />,
        children: [
          { index: true, element: <SuspenseWrapper><PlansPage /></SuspenseWrapper> },
        ],
      },
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true,        element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
          { path: 'videos',       element: <SuspenseWrapper><VideosPage /></SuspenseWrapper> },
          { path: 'wallet',       element: <SuspenseWrapper><WalletPage /></SuspenseWrapper> },
          { path: 'referrals',    element: <SuspenseWrapper><ReferralsPage /></SuspenseWrapper> },
          { path: 'tasks',        element: <SuspenseWrapper><TasksPage /></SuspenseWrapper> },
          { path: 'leaderboard',  element: <SuspenseWrapper><LeaderboardPage /></SuspenseWrapper> },
          { path: 'settings',     element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
          { path: 'support',      element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
        ],
      },
    ],
  },
]);

export default router;