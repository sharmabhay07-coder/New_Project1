import AdminTable from '../components/AdminTable'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
]
const users = []

export default function AdminUsersPage() {
  return (
    <div className="dash-page dash-space-y-6">
      <div>
        <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">
          Users
        </h1>
      </div>
      <input
        type="text"
        placeholder="Search users..."
        className="dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-focus:border-primary/50 dash-outline-none dash-focus:ring-2 dash-focus:ring-primary/20"
      />
      <AdminTable
        columns={columns}
        data={users}
        emptyMessage="No users found"
      />
    </div>
  )
}