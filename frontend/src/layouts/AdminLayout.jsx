import AdminSidebar from '../pages/admin/components/AdminSidebar'
import AdminHeader from '../pages/admin/components/AdminHeader'
import { Outlet } from 'react-router-dom'


export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminSidebar />

            <div className="admin-content">
                <AdminHeader />
                <Outlet />
            </div>
        </div>
    )
}
