import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import BlankLayout from '../layouts/BlankLayout';
import Home from '../../pages/home/Home';
import Auth from '../../pages/auth/Auth';

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
  
]);

export default router;