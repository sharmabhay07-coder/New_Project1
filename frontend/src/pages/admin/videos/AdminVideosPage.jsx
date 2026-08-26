import AdminTable from '../components/AdminTable'

const columns = [
  { key: 'title', label: 'Video' },
  { key: 'user', label: 'User' },
  { key: 'status', label: 'Status' },
]
const videos = []

export default function AdminVideosPage() {
  return (
    <div className="dash-page dash-space-y-6">
      <div>
        <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">
          Videos
        </h1>
      </div>
      <div className="dash-flex dash-gap-3">
        <input
          type="text"
          placeholder="Search videos..."
          className="dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-focus:border-primary/50 dash-outline-none dash-focus:ring-2 dash-focus:ring-primary/20"
        />
        <select className="dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-outline-none">
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>
      <AdminTable
        columns={columns}
        data={videos}
        emptyMessage="No videos found"
      />
    </div>
  )
}