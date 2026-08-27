import { useCallback, useEffect, useMemo, useState } from 'react'

import useAuth from '@/hooks/useAuth'
import { getAdminUsers } from '@/lib/api/userApi'

import AdminTable from '../components/AdminTable'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
]
export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  const { token } = useAuth()

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setUsers([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await getAdminUsers(token)
      setUsers(res.data?.users || [])
    } catch (err) {
      console.error('Failed to fetch admin users:', err)
      setUsers([])
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [fetchUsers])

  const rows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return users
      .filter((user) => {
        if (!query) return true

        return [user.name, user.email]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))
      })
      .map((user) => ({
        id: user._id,
        name: user.name || 'Unnamed user',
        email: user.email || 'No email',
        role: user.role || 'user',
      }))
  }, [searchQuery, users])

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
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-focus:border-primary/50 dash-outline-none dash-focus:ring-2 dash-focus:ring-primary/20"
      />

      {error ? (
        <div className="dash-rounded-2xl dash-border dash-border-destructive dash-bg-background dash-p-4 dash-text-sm dash-text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="dash-card dash-p-6 dash-space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="dash-flex dash-items-center dash-gap-3 dash-animate-pulse"
            >
              <div className="dash-flex-1 dash-space-y-2">
                <div className="dash-h-4 dash-w-64 dash-rounded-lg dash-bg-muted" />
                <div className="dash-h-3 dash-w-40 dash-rounded-lg dash-bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={rows}
          emptyMessage="No users found"
        />
      )}
    </div>
  )
}