import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import BlankLayout from '../layouts/BlankLayout';

import Home from '../../pages/home/Home';
import Auth from '../../pages/auth/Auth';

// Every page Shubham builds gets ONE line here.
// Pages that need Navbar/Footer go under MainLayout's children.
// Full-screen pages (auth, 404) go under BlankLayout's children.
const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: '/', element: <Home /> },
            // { path: '/dashboard', element: <Dashboard /> },  ← example for later
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
