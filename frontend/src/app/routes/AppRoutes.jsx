import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from '../../layouts/MainLayout'
import BlankLayout from '../../layouts/BlankLayout'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../../layouts/DashboardLayout'

// Eagerly load Home and Auth
import Home from '../../pages/home/Home'
import Auth from '../../pages/auth/Auth'

// Lazy-load public pages
const HowItWorks = lazy(() =>
  import('../../pages/how-it-works/HowItWorks')
)

const FAQPage = lazy(() =>
  import('../../pages/faq/FAQPage')
)

const FeaturesPage = lazy(() =>
  import('../../pages/features/FeaturesPage')
)

const PlansPage = lazy(() =>
  import('../../pages/plans/PlansPage')
)

const SelectionPage = lazy(() =>
  import('../../pages/selection/SelectionPage')
)

// Lazy-load dashboard pages
const Dashboard = lazy(() =>
  import('../../pages/dashboard/Dashboard')
)

const VideosPage = lazy(() =>
  import('../../pages/dashboard/videos/VideosPage')
)

const VideoWatchPage = lazy(() =>
  import('../../pages/dashboard/videos/VideoWatchPage')
)

const WalletPage = lazy(() =>
  import('../../pages/dashboard/wallet/WalletPage')
)

const ReferralsPage = lazy(() =>
  import('../../pages/dashboard/referrals/ReferralsPage')
)

const TasksPage = lazy(() =>
  import('../../pages/dashboard/tasks/TasksPage')
)

const LeaderboardPage = lazy(() =>
  import('../../pages/dashboard/LeaderboardPage')
)

const SettingsPage = lazy(() =>
  import('../../pages/dashboard/SettingsPage')
)

// Page loader
function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
    </div>
  )
}

function SuspenseWrapper({ children }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  )
}

const router = createBrowserRouter([
  // =====================================================
  // PUBLIC ROUTES
  // =====================================================
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },

      {
        path: '/how-it-works',
        element: (
          <SuspenseWrapper>
            <HowItWorks />
          </SuspenseWrapper>
        ),
      },

      {
        path: '/faq',
        element: (
          <SuspenseWrapper>
            <FAQPage />
          </SuspenseWrapper>
        ),
      },

      {
        path: '/features',
        element: (
          <SuspenseWrapper>
            <FeaturesPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // =====================================================
  // AUTH
  // =====================================================
  {
    element: <BlankLayout />,
    children: [
      {
        path: '/auth',
        element: <Auth />,
      },
    ],
  },

  // =====================================================
  // PROTECTED ROUTES
  // =====================================================
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/selection',
        element: <BlankLayout />,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <SelectionPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },

      // =================================================
      // DASHBOARD
      // =================================================
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <Dashboard />
              </SuspenseWrapper>
            ),
          },

          {
            path: 'plans',
            element: (
              <SuspenseWrapper>
                <PlansPage />
              </SuspenseWrapper>
            ),
          },

          // Videos
          {
            path: 'videos',
            element: (
              <SuspenseWrapper>
                <VideosPage />
              </SuspenseWrapper>
            ),
          },

          // Watch Single Video
          {
            path: 'videos/:id',
            element: (
              <SuspenseWrapper>
                <VideoWatchPage />
              </SuspenseWrapper>
            ),
          },

          {
            path: 'wallet',
            element: (
              <SuspenseWrapper>
                <WalletPage />
              </SuspenseWrapper>
            ),
          },

          {
            path: 'referrals',
            element: (
              <SuspenseWrapper>
                <ReferralsPage />
              </SuspenseWrapper>
            ),
          },

          {
            path: 'tasks',
            element: (
              <SuspenseWrapper>
                <TasksPage />
              </SuspenseWrapper>
            ),
          },

          {
            path: 'leaderboard',
            element: (
              <SuspenseWrapper>
                <LeaderboardPage />
              </SuspenseWrapper>
            ),
          },

          {
            path: 'settings',
            element: (
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            ),
          },

          {
            path: 'support',
            element: (
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
])

export default router